import React, { useState, useEffect } from 'react';
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
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import FeedbackSuccessModal from '../../components/feedbackSuccessModal/Index';
import Styles from './Styles';
import colors from '../../constants/colors';
import { showToast } from '../../utils/toast';
import { pickImageAsset, PickedImageAsset } from '../../utils/image';
import { APP_VERSION, BUILD_NUMBER, OS_VERSION, DEVICE_MODEL } from '../../utils/faceCapture';
import { isFeedbackApiConfigured } from '../../constants/config';
import {
  submitFeedback,
  uploadFeedbackImage,
  warmUpFeedbackServers,
  FeedbackApiNotConfigured,
  FeedbackType,
  FeedbackPayload,
} from '../../api/feedback';
import { RootStackParamList } from '../../navigation/AppContainer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Reusable labelled text input (module-level so it keeps focus across renders).
const LabeledInput = ({
  label,
  error,
  showCount,
  ...props
}: { label: string; error?: string; showCount?: boolean } & TextInputProps) => (
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
    {error || (showCount && props.maxLength) ? (
      <View style={Styles.inputFooter}>
        <Text style={[Styles.errorText, Styles.errorTextFlush]}>{error || ''}</Text>
        {showCount && props.maxLength ? (
          <Text style={Styles.countText}>
            {String(props.value ?? '').length}/{props.maxLength}
          </Text>
        ) : null}
      </View>
    ) : null}
  </View>
);

interface DropdownOption {
  value: string;
  label: string;
}

// Labelled dropdown backed by react-native-element-dropdown (inline list, no modal).
const Dropdown = ({
  label,
  placeholder,
  value,
  options,
  onSelect,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  error?: string;
}) => (
  <View style={Styles.inputContainer}>
    <Text style={Styles.label}>{label}</Text>
    <ElementDropdown
      style={[Styles.dropdownTrigger, error ? Styles.inputError : null]}
      data={options}
      labelField="label"
      valueField="value"
      value={value}
      placeholder={placeholder}
      placeholderStyle={Styles.dropdownPlaceholder}
      selectedTextStyle={Styles.dropdownText}
      itemTextStyle={Styles.optionText}
      containerStyle={Styles.dropdownList}
      activeColor={`${colors.BRAND}0D`}
      onChange={(item) => onSelect(item.value)}
      renderRightIcon={() => (
        <Icon name="chevron-down" size="sm" color={colors.SURFACE_TEXT_MUTED} strokeWidth={2.2} />
      )}
    />
    {error ? <Text style={Styles.errorText}>{error}</Text> : null}
  </View>
);

const FEEDBACK_TYPES: DropdownOption[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'other', label: 'Other' },
];

// App modules the feedback can be about. The stored/sent value is the lowercase label.
const MODULES: DropdownOption[] = ['Attendance', 'Users', 'Payroll', 'Reports', 'Settings', 'Other'].map(
  (m) => ({ value: m, label: m }),
);

interface FormErrors {
  feedbackType?: string;
  module?: string;
  description?: string;
  name?: string;
  phone?: string;
}

const Feedback = () => {
  const navigation = useNavigation<NavigationProp>();

  const [feedbackType, setFeedbackType] = useState<FeedbackType | ''>('');
  const [module, setModule] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<PickedImageAsset | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Wake the (possibly sleeping) feedback + image upload servers as soon as the
  // form opens, so submit/upload are fast instead of waiting on a cold start.
  useEffect(() => {
    warmUpFeedbackServers();
  }, []);

  const clearError = (key: keyof FormErrors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!feedbackType) e.feedbackType = 'Please select a feedback type';
    if (!module) e.module = 'Please select a module';
    if (!description.trim()) e.description = 'Description is required';
    if (phone.trim() && !/^[0-9]{10}$/.test(phone.trim()))
      e.phone = 'Enter a valid 10 digit phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePickImage = async () => {
    const asset = await pickImageAsset();
    if (asset) setImage(asset);
  };

  const handleSubmit = async () => {
    if (submitting || !validate()) return;

    if (!isFeedbackApiConfigured()) {
      showToast('Feedback service is not configured yet', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Upload the screenshot first (if any) so we can send its hosted URL.
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadFeedbackImage(image);
      }

      const payload: FeedbackPayload = {
        feedbackType: feedbackType as FeedbackType,
        module: module.toLowerCase(),
        description: description.trim(),
        name: name.trim(),
        phone: phone.trim(),
        image: imageUrl,
        appVersion: APP_VERSION,
        buildNumber: String(BUILD_NUMBER),
        osVersion: OS_VERSION,
        deviceModel: DEVICE_MODEL,
      };

      const message = await submitFeedback(payload);
      setSuccessMessage(message);
    } catch (error: any) {
      console.error('Feedback submit error:', error);
      if (error instanceof FeedbackApiNotConfigured) {
        showToast('Feedback service is not configured yet', 'error');
      } else {
        showToast('Could not send feedback. Please try again.', 'error');
      }
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Send Feedback" showBack />
      <ScrollView style={Styles.scrollView} contentContainerStyle={Styles.scrollContent}>
        {/* What & where */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_BLUE}18` }]}>
              <Icon name="feedback" size="sm" color={colors.ACCENT_BLUE} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Feedback</Text>
          </View>

          <Dropdown
            label="Type *"
            placeholder="Select feedback type"
            value={feedbackType}
            options={FEEDBACK_TYPES}
            onSelect={(v) => {
              setFeedbackType(v as FeedbackType);
              clearError('feedbackType');
            }}
            error={errors.feedbackType}
          />

          <Dropdown
            label="Module *"
            placeholder="Select a module"
            value={module}
            options={MODULES}
            onSelect={(v) => {
              setModule(v);
              clearError('module');
            }}
            error={errors.module}
          />

          <LabeledInput
            label="Description *"
            placeholder="Describe the issue or suggestion"
            multiline
            maxLength={500}
            showCount
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              clearError('description');
            }}
            error={errors.description}
          />

          {/* Screenshot */}
          <View style={Styles.inputContainer}>
            <Text style={Styles.label}>Screenshot</Text>
            {image ? (
              <View style={Styles.imagePreviewWrap}>
                <Image source={{ uri: image.uri }} style={Styles.imagePreview} />
                <View style={Styles.imageActionsOverlay}>
                  <TouchableOpacity style={Styles.imageActionPill} activeOpacity={0.85} onPress={handlePickImage}>
                    <Icon name="retake" size="xs" color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={Styles.imageActionText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Styles.imageActionPill} activeOpacity={0.85} onPress={() => setImage(null)}>
                    <Icon name="trash" size="xs" color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={Styles.imageActionText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={Styles.imagePlaceholder} activeOpacity={0.85} onPress={handlePickImage}>
                <View style={Styles.placeholderIconCircle}>
                  <Icon name="image" size="lg" color={colors.BRAND} strokeWidth={1.8} />
                </View>
                <Text style={Styles.imagePlaceholderText}>Attach a screenshot</Text>
                <Text style={Styles.imagePlaceholderHint}>Tap to choose from gallery</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contact */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_GREEN}18` }]}>
              <Icon name="user" size="sm" color={colors.ACCENT_GREEN} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Your Details</Text>
          </View>

          <LabeledInput
            label="Name"
            placeholder="Enter your name"
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
            maxLength={10}
            value={phone}
            onChangeText={(t) => {
              setPhone(t.replace(/[^0-9]/g, '').slice(0, 10));
              clearError('phone');
            }}
            error={errors.phone}
          />
        </View>

        {/* Device info — auto-attached, read-only */}
        <View style={Styles.card}>
          <View style={Styles.sectionHeader}>
            <View style={[Styles.sectionIcon, { backgroundColor: `${colors.ACCENT_SLATE}18` }]}>
              <Icon name="settings" size="sm" color={colors.ACCENT_SLATE} strokeWidth={2} />
            </View>
            <Text style={Styles.sectionTitle}>Device Info</Text>
          </View>

          <Text style={Styles.metaNote}>
            These details are stored along with your feedback to help us fix issues faster.
          </Text>

          <View style={Styles.metaRow}>
            <Text style={Styles.metaLabel}>App Version</Text>
            <Text style={Styles.metaValue}>{APP_VERSION} ({BUILD_NUMBER})</Text>
          </View>
          <View style={Styles.metaRow}>
            <Text style={Styles.metaLabel}>OS</Text>
            <Text style={Styles.metaValue}>{OS_VERSION}</Text>
          </View>
          <View style={Styles.metaRow}>
            <Text style={Styles.metaLabel}>Device</Text>
            <Text style={Styles.metaValue}>{DEVICE_MODEL}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={Styles.submitButton}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={Styles.submitButtonText}>Sending…</Text>
            </>
          ) : (
            <>
              <Icon name="feedback" size="sm" color="#FFFFFF" strokeWidth={2.2} />
              <Text style={Styles.submitButtonText}>Send Feedback</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <FeedbackSuccessModal
        visible={successMessage !== null}
        message={successMessage ?? ''}
        onDone={() => {
          setSuccessMessage(null);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default Feedback;
