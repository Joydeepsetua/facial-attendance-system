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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import Styles from '../createUser/Styles';
import colors from '../../constants/colors';
import { pickImageFromGallery } from '../../utils/image';
import { showToast } from '../../utils/toast';
import {
  validateEmail,
  validatePan,
  validatePhone,
  validateWebsite,
  validateGstin,
} from '../../utils/validation';
import { getOrganization, saveOrganization } from '../../sqlite/service/organization';

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

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstin?: string;
  pan?: string;
}

const Organization = () => {
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    getOrganization().then((org) => {
      if (org) {
        setLogo(org.logo ?? null);
        setName(org.name ?? '');
        setPhone(org.phone ?? '');
        setEmail(org.email ?? '');
        setAddress(org.address ?? '');
        setWebsite(org.website ?? '');
        setGstin(org.gstin ?? '');
        setPan(org.pan ?? '');
      }
      setLoading(false);
    });
  }, []);

  const clearError = (key: keyof FormErrors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const handlePickLogo = async () => {
    const image = await pickImageFromGallery();
    if (image) setLogo(image);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Organization name is required';
    e.phone = validatePhone(phone);
    e.email = validateEmail(email);
    e.website = validateWebsite(website);
    e.gstin = validateGstin(gstin);
    e.pan = validatePan(pan);
    (Object.keys(e) as (keyof FormErrors)[]).forEach((k) => e[k] === undefined && delete e[k]);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const success = await saveOrganization({
      name,
      logo,
      phone,
      email,
      address,
      website,
      gstin,
      pan,
    });
    if (success) {
      showToast('Organization details saved!', 'success');
    } else {
      showToast('Failed to save organization', 'error');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
        <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
        <Header title="Organization" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.BRAND} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Organization" showBack />
      <ScrollView style={Styles.scrollView} contentContainerStyle={Styles.scrollContent}>
        {/* Logo */}
        <View style={Styles.profileHeader}>
          <TouchableOpacity style={Styles.avatarWrap} activeOpacity={0.85} onPress={handlePickLogo}>
            {logo ? (
              <Image source={{ uri: `data:image/jpeg;base64,${logo}` }} style={Styles.avatarImage} />
            ) : (
              <View style={Styles.avatarPlaceholder}>
                <Icon name="building" size="xl" color={colors.BRAND} strokeWidth={1.8} />
              </View>
            )}
            <View style={Styles.avatarBadge}>
              <Icon name="image" size="xs" color="#FFFFFF" strokeWidth={2.2} />
            </View>
          </TouchableOpacity>
          <Text style={Styles.avatarHint}>Tap to {logo ? 'change' : 'add'} logo</Text>
        </View>

        {/* Company details */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_BLUE}18` }]}>
              <Icon name="building" size="sm" color={colors.ACCENT_BLUE} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Company Details</Text>
          </View>

          <LabeledInput
            label="Organization Name *"
            placeholder="Enter organization name"
            value={name}
            onChangeText={(t) => {
              setName(t);
              clearError('name');
            }}
            error={errors.name}
          />
          <LabeledInput
            label="Phone"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              clearError('phone');
            }}
            error={errors.phone}
          />
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
          <LabeledInput
            label="Website"
            placeholder="Enter website"
            keyboardType="url"
            autoCapitalize="none"
            value={website}
            onChangeText={(t) => {
              setWebsite(t);
              clearError('website');
            }}
            error={errors.website}
          />
        </View>

        {/* Tax & statutory */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_GREEN}18` }]}>
              <Icon name="card" size="sm" color={colors.ACCENT_GREEN} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Tax & Statutory</Text>
          </View>

          <LabeledInput
            label="GSTIN"
            placeholder="Enter GSTIN"
            autoCapitalize="characters"
            value={gstin}
            onChangeText={(t) => {
              setGstin(t);
              clearError('gstin');
            }}
            error={errors.gstin}
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
        </View>

        <TouchableOpacity style={Styles.createButton} activeOpacity={0.85} onPress={handleSave}>
          <Icon name="check" size="sm" color="#FFFFFF" strokeWidth={2.5} />
          <Text style={Styles.createButtonText}>Save Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Organization;
