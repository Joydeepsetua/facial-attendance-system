import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
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
    `${APP_NAME} is a facial attendance app that works entirely on your device. This policy ` +
    `explains, in simple terms, what data the app uses and how it is kept. By using the app you ` +
    `agree to this policy.`,
  sections: [
    {
      heading: '1. What we collect',
      body:
        'To register an employee, the app captures a face photo and turns it into a numeric face ' +
        'signature. It also stores the employee details you enter, such as name, phone number, ' +
        'employee ID, and optional payroll/bank details.',
    },
    {
      heading: '2. How it is stored',
      body:
        'All data — face signatures, employee details and attendance — is stored only on this ' +
        'device and nowhere else. We do not keep any copy of your data on a server or cloud, and ' +
        'nothing is uploaded or shared over the internet by the app.',
    },
    {
      heading: '3. No backup — data loss',
      body:
        'Because the data lives only on this device, it cannot be recovered by us. If you delete ' +
        'the data, uninstall the app, clear the app data, reset or format the phone, or the device ' +
        'is lost or damaged, all attendance and employee data will be permanently lost. Please ' +
        'keep your own backup/export if you need to retain records.',
    },
    {
      heading: '4. How it is used',
      body:
        'The face signature is used only to recognise a registered employee and record their ' +
        'punch-in and punch-out. Employee details are used to identify staff and, if enabled, for ' +
        'payroll.',
    },
    {
      heading: '5. Consent',
      body:
        'Every employee should be told and should agree before their face is registered. The ' +
        'organization using the app is responsible for taking this consent.',
    },
    {
      heading: '6. Deletion & your choices',
      body:
        'Deleting an employee removes their details and face signature from the device. ' +
        'Uninstalling the app removes the locally stored data. You may ask the administrator to ' +
        'view, correct or delete your data at any time.',
    },
    {
      heading: '7. Contact',
      body:
        'For any question about your data or this policy, please contact your organization\'s ' +
        'administrator. This policy is governed by the laws of India and may be updated from time ' +
        'to time.',
    },
  ],
};

const TERMS: Doc = {
  title: 'Terms & Conditions',
  updated: LAST_UPDATED,
  intro:
    `Please read these Terms before using ${APP_NAME}. By using the app you agree to them.`,
  sections: [
    {
      heading: '1. Use of the app',
      body:
        `${APP_NAME} is for managing employee attendance using face recognition. Use it only for ` +
        'lawful attendance and workforce-management purposes.',
    },
    {
      heading: '2. Your responsibilities',
      body:
        'You must take each employee\'s consent before registering their face, keep the employee ' +
        'information accurate, and keep the device and app access secure.',
    },
    {
      heading: '3. Acceptable use',
      body:
        'Do not register or scan anyone without their consent, impersonate another person, or ' +
        'tamper with attendance records.',
    },
    {
      heading: '4. Accuracy',
      body:
        'Face recognition may not be 100% accurate and can be affected by lighting, camera quality ' +
        'and appearance changes. Please review records where accuracy is important.',
    },
    {
      heading: '5. Liability',
      body:
        'The app is provided "as is" without any warranty. We are not liable for any loss arising ' +
        'from use of the app, including incorrect attendance records.',
    },
    {
      heading: '6. Changes & law',
      body:
        'These Terms may be updated from time to time; continued use means you accept the changes. ' +
        'These Terms are governed by the laws of India.',
    },
  ],
};

const Legal = () => {
  const route = useRoute<LegalRoute>();
  const doc = route.params?.type === 'terms' ? TERMS : PRIVACY;
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <SafeAreaView
      style={Styles.screen}
      edges={['top', 'bottom']}
      onLayout={(e) =>
        setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
      }
    >
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      {/* Faint top-down gradient so the page isn't flat white */}
      {size.width > 0 && (
        <Svg style={StyleSheet.absoluteFill} width={size.width} height={size.height}>
          <Defs>
            <SvgLinearGradient id="legalBg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={size.height}>
              <Stop offset="0" stopColor="#F4F6FB" />
              <Stop offset="0.45" stopColor="#EAF1FF" />
              <Stop offset="1" stopColor="#CFE0FF" />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="0" width={size.width} height={size.height} fill="url(#legalBg)" />
        </Svg>
      )}
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
