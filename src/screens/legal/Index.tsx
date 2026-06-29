import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import Header from '../../components/header/Index';
import colors from '../../constants/colors';
import { RootStackParamList } from '../../navigation/AppContainer';
import Styles from './Styles';

type LegalRoute = RouteProp<RootStackParamList, 'Legal'>;

interface Section {
  heading: string;
  body: string;
}

interface Doc {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}

const APP_NAME = 'FaceTen';
const LAST_UPDATED = 'June 2026';

const PRIVACY: Doc = {
  title: 'Privacy Policy',
  updated: LAST_UPDATED,
  intro:
    `${APP_NAME} is a facial attendance application. This policy explains what data the app ` +
    `collects, how it is used, and how it is stored. By using the app you agree to this policy.`,
  sections: [
    {
      heading: '1. Data We Collect',
      body:
        'To mark attendance the app captures a photo of the user\'s face and derives a numeric ' +
        'face signature (embedding) from it. We also store basic employee details you enter, such ' +
        'as name, phone number, employee ID, and optional payroll/bank fields.',
    },
    {
      heading: '2. How Data Is Stored',
      body:
        'All data — including face signatures and employee records — is stored locally on this ' +
        'device in the app\'s private database. Captured face images are processed on-device and ' +
        'are not uploaded to any external server by the app.',
    },
    {
      heading: '3. How We Use Your Data',
      body:
        'Face signatures are used solely to recognize a registered user and record their punch-in ' +
        'and punch-out times. Employee details are used to identify staff and, where enabled, to ' +
        'support payroll reporting.',
    },
    {
      heading: '4. Data Sharing',
      body:
        'The app does not sell or share your personal data with third parties. Data leaves the ' +
        'device only if you or your organization explicitly export or back it up.',
    },
    {
      heading: '5. Data Retention & Deletion',
      body:
        'Records remain until an administrator deletes them. Removing a user from the app deletes ' +
        'that user\'s details and face signature from the device.',
    },
    {
      heading: '6. Consent',
      body:
        'Each employee should be informed and should consent before their face is registered for ' +
        'attendance. The organization operating this app is responsible for obtaining that consent.',
    },
    {
      heading: '7. Contact',
      body:
        'For any questions about this policy or your data, please contact your organization\'s ' +
        'administrator.',
    },
  ],
};

const TERMS: Doc = {
  title: 'Terms & Conditions',
  updated: LAST_UPDATED,
  intro:
    `Please read these Terms & Conditions carefully before using ${APP_NAME}. By using the app ` +
    `you agree to be bound by these terms.`,
  sections: [
    {
      heading: '1. Use of the App',
      body:
        `${APP_NAME} is provided for managing employee attendance using facial recognition. You ` +
        'agree to use it only for lawful attendance and workforce-management purposes.',
    },
    {
      heading: '2. Accounts & Data Accuracy',
      body:
        'You are responsible for the accuracy of the employee information entered into the app and ' +
        'for keeping device access secure.',
    },
    {
      heading: '3. Acceptable Use',
      body:
        'You must not use the app to register a person without their knowledge, to impersonate ' +
        'another individual, or to tamper with attendance records.',
    },
    {
      heading: '4. Accuracy of Recognition',
      body:
        'Facial recognition may not be 100% accurate and can be affected by lighting, camera ' +
        'quality, and appearance changes. Attendance records should be reviewed where accuracy is ' +
        'critical.',
    },
    {
      heading: '5. Limitation of Liability',
      body:
        'The app is provided "as is" without warranties of any kind. The developers are not liable ' +
        'for any loss arising from use of the app, including incorrect attendance records.',
    },
    {
      heading: '6. Changes to These Terms',
      body:
        'These terms may be updated from time to time. Continued use of the app after changes ' +
        'constitutes acceptance of the updated terms.',
    },
  ],
};

const Legal = () => {
  const route = useRoute<LegalRoute>();
  const doc = route.params?.type === 'terms' ? TERMS : PRIVACY;

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title={doc.title} showBack />
      <ScrollView contentContainerStyle={Styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={Styles.updated}>Last updated: {doc.updated}</Text>
        <Text style={Styles.intro}>{doc.intro}</Text>
        {doc.sections.map((s) => (
          <View key={s.heading} style={Styles.section}>
            <Text style={Styles.heading}>{s.heading}</Text>
            <Text style={Styles.body}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Legal;
