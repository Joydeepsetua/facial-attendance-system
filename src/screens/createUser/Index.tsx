import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  NativeModules,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import DuplicateFaceModal from '../../components/duplicateFaceModal/Index';
import Icon from '../../components/icons/Index';
import Styles from './Styles';
import colors from '../../constants/colors';
import { openCamera } from '../../utils/camera';
import { createUser, getNextEmployeeId, UserInput, SalaryType } from '../../sqlite/service/user';
import { showToast } from '../../utils/toast';
import { findDuplicateUsers, FaceMatch } from '../../utils/face';
import { validateEmail, validateIfsc, validatePan, validateUan } from '../../utils/validation';
import { RootStackParamList } from '../../navigation/AppContainer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Reusable labelled text input (module-level so it keeps focus across renders).
const LabeledInput = ({
  label,
  error,
  ...props
}: { label: string; error?: string } & TextInputProps) => (
  <View style={Styles.inputContainer}>
    <Text style={Styles.label}>{label}</Text>
    <TextInput
      style={[
        Styles.input,
        props.multiline ? Styles.inputMultiline : null,
        error ? Styles.inputError : null,
      ]}
      placeholderTextColor={colors.SURFACE_TEXT_MUTED}
      {...props}
    />
    {error ? <Text style={Styles.errorText}>{error}</Text> : null}
  </View>
);

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

interface FormErrors {
  name?: string;
  phone?: string;
  gender?: string;
  photo?: string;
  email?: string;
  ifsc?: string;
  pan?: string;
  uan?: string;
}

const CreateUser = () => {
  const navigation = useNavigation<NavigationProp>();

  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [salaryType, setSalaryType] = useState<SalaryType>('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [pan, setPan] = useState('');
  const [pf, setPf] = useState('');
  const [esi, setEsi] = useState('');
  const [uan, setUan] = useState('');

  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [pendingEmbedding, setPendingEmbedding] = useState<number[] | null>(null);
  const [duplicateMatches, setDuplicateMatches] = useState<FaceMatch[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNextEmployeeId().then(setEmployeeId);
  }, []);

  const clearError = (key: keyof FormErrors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!fullName.trim()) e.name = 'Full name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s]{7,15}$/.test(phone.trim())) e.phone = 'Enter a valid phone number';
    if (!gender) e.gender = 'Please select gender';
    if (!base64Image) e.photo = 'Profile photo is required';
    e.email = validateEmail(email);
    e.ifsc = validateIfsc(ifsc);
    e.pan = validatePan(pan);
    e.uan = validateUan(uan);
    Object.keys(e).forEach((k) => e[k as keyof FormErrors] === undefined && delete e[k as keyof FormErrors]);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildInput = (): UserInput => ({
    name: fullName,
    phone,
    gender,
    email,
    address,
    salaryType,
    salaryAmount: salaryType && salaryAmount ? Number(salaryAmount) : null,
    bankAccount,
    ifsc,
    pan,
    pf,
    esi,
    uan,
  });

  const handleImagePicker = async () => {
    const image = await openCamera();
    if (!image) return;
    setBase64Image(image);
    clearError('photo');
  };

  const saveUser = async (embeddingArray: number[]) => {
    const success = await createUser(buildInput(), embeddingArray);
    if (success) {
      showToast('User created successfully!', 'success');
      // keep the loader on while we navigate away
      setTimeout(() => navigation.goBack(), 500);
    } else {
      showToast('Failed to create user', 'error');
      setSaving(false);
    }
  };

  const handleCreateUser = async () => {
    if (saving || !validate()) return;
    setSaving(true);

    try {
      const embedding = await NativeModules.FaceEmbedding.getEmbedding(base64Image);
      const embeddingArray = embedding.split(',').map(Number);

      const duplicates = await findDuplicateUsers(embeddingArray);
      if (duplicates.length > 0) {
        setPendingEmbedding(embeddingArray);
        setDuplicateMatches(duplicates);
        setSaving(false); // pause while the user decides in the modal
        return;
      }

      await saveUser(embeddingArray);
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error?.message || error?.toString() || '';
      if (errorMessage.includes('No face detected')) {
        showToast('Error: No face detected', 'error');
      } else {
        showToast('Failed to create user', 'error');
      }
      setSaving(false);
    }
  };

  const handleConfirmDuplicate = async () => {
    const embeddingArray = pendingEmbedding;
    setDuplicateMatches([]);
    setPendingEmbedding(null);
    if (embeddingArray) {
      setSaving(true);
      await saveUser(embeddingArray);
    }
  };

  const handleCancelDuplicate = () => {
    setDuplicateMatches([]);
    setPendingEmbedding(null);
  };

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Add User" showBack />
      <ScrollView style={Styles.scrollView} contentContainerStyle={Styles.scrollContent}>
        {/* Profile header */}
        <View style={Styles.profileHeader}>
          <TouchableOpacity style={Styles.avatarWrap} activeOpacity={0.85} onPress={handleImagePicker}>
            {base64Image ? (
              <Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={Styles.avatarImage} />
            ) : (
              <View style={Styles.avatarPlaceholder}>
                <Icon name="camera" size="xl" color={colors.BRAND} strokeWidth={1.8} />
              </View>
            )}
            <View style={Styles.avatarBadge}>
              <Icon name="camera" size="xs" color="#FFFFFF" strokeWidth={2.2} />
            </View>
          </TouchableOpacity>
          <View style={Styles.idPill}>
            <Icon name="user" size="xs" color={colors.BRAND} strokeWidth={2.2} />
            <Text style={Styles.idPillText}>ID {employeeId || '—'}</Text>
          </View>
          {errors.photo ? (
            <Text style={[Styles.errorText, { textAlign: 'center' }]}>{errors.photo}</Text>
          ) : null}
        </View>

        {/* Personal */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_BLUE}18` }]}>
              <Icon name="user" size="sm" color={colors.ACCENT_BLUE} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Personal</Text>
          </View>

          <LabeledInput
            label="Full Name *"
            placeholder="Enter full name"
            value={fullName}
            onChangeText={(t) => {
              setFullName(t);
              clearError('name');
            }}
            error={errors.name}
          />
          <LabeledInput
            label="Phone *"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              clearError('phone');
            }}
            error={errors.phone}
          />

          <View style={Styles.inputContainer}>
            <Text style={Styles.label}>Gender *</Text>
            <View style={Styles.segmentRow}>
              {GENDER_OPTIONS.map((g) => {
                const active = gender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[Styles.segmentChip, active && Styles.segmentChipActive]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setGender(g);
                      clearError('gender');
                    }}
                  >
                    <Text style={[Styles.segmentChipText, active && Styles.segmentChipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.gender ? <Text style={Styles.errorText}>{errors.gender}</Text> : null}
          </View>

          <LabeledInput
            label="Email"
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError('email');
            }}
            error={errors.email}
          />
          <LabeledInput
            label="Address"
            placeholder="Enter address"
            multiline
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Salary */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_AMBER}18` }]}>
              <Icon name="wallet" size="sm" color={colors.ACCENT_AMBER} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Salary</Text>
          </View>

          <View style={Styles.inputContainer}>
            <Text style={Styles.label}>Salary Type</Text>
            <View style={Styles.segmentRow}>
              {(['fixed', 'daily'] as SalaryType[]).map((t) => {
                const active = salaryType === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[Styles.segmentChip, active && Styles.segmentChipActive]}
                    activeOpacity={0.85}
                    onPress={() => setSalaryType(active ? '' : t)}
                  >
                    <Text style={[Styles.segmentChipText, active && Styles.segmentChipTextActive]}>
                      {t === 'fixed' ? 'Fixed' : 'Daily'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {salaryType !== '' && (
            <LabeledInput
              label={salaryType === 'fixed' ? 'Monthly Amount' : 'Daily Amount'}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={salaryAmount}
              onChangeText={setSalaryAmount}
            />
          )}
          {salaryType === 'daily' && (
            <Text style={Styles.helperText}>Payroll = daily amount × days present (from attendance)</Text>
          )}
        </View>

        {/* Bank & Statutory */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_GREEN}18` }]}>
              <Icon name="card" size="sm" color={colors.ACCENT_GREEN} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Bank & Statutory</Text>
          </View>

          <LabeledInput
            label="Bank Account Number"
            placeholder="Enter account number"
            keyboardType="numeric"
            value={bankAccount}
            onChangeText={setBankAccount}
          />
          <LabeledInput
            label="IFSC Code"
            placeholder="Enter IFSC"
            autoCapitalize="characters"
            value={ifsc}
            onChangeText={(t) => {
              setIfsc(t);
              clearError('ifsc');
            }}
            error={errors.ifsc}
          />
          <LabeledInput
            label="PAN"
            placeholder="Enter PAN"
            autoCapitalize="characters"
            value={pan}
            onChangeText={(t) => {
              setPan(t);
              clearError('pan');
            }}
            error={errors.pan}
          />
          <LabeledInput label="PF Number" placeholder="Enter PF number" value={pf} onChangeText={setPf} />
          <LabeledInput label="ESI Number" placeholder="Enter ESI number" value={esi} onChangeText={setEsi} />
          <LabeledInput
            label="UAN"
            placeholder="Enter UAN"
            keyboardType="numeric"
            value={uan}
            onChangeText={(t) => {
              setUan(t);
              clearError('uan');
            }}
            error={errors.uan}
          />
        </View>

        <TouchableOpacity
          style={Styles.createButton}
          activeOpacity={0.85}
          onPress={handleCreateUser}
          disabled={saving}
        >
          {saving ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={Styles.createButtonText}>Creating…</Text>
            </>
          ) : (
            <>
              <Icon name="user-plus" size="sm" color="#FFFFFF" strokeWidth={2.2} />
              <Text style={Styles.createButtonText}>Create User</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <DuplicateFaceModal
        visible={duplicateMatches.length > 0}
        matches={duplicateMatches}
        onCancel={handleCancelDuplicate}
        onConfirm={handleConfirmDuplicate}
      />
    </SafeAreaView>
  );
};

export default CreateUser;
