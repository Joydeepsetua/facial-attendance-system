import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppContainer';
import Icon from '../../components/icons/Index';
import { AppIconName } from '../../components/icons/icons';
import Styles, { dash } from './Styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Per-feature presentation, keyed by route name.
const META: Record<string, { icon: AppIconName; blurb: string }> = {
  Payroll: { icon: 'wallet', blurb: 'Manage salaries, payslips and payouts — landing here soon.' },
  Settings: { icon: 'settings', blurb: 'App preferences and configuration — landing here soon.' },
};

const ComingSoon = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const meta = META[route.name] ?? { icon: 'clock' as AppIconName, blurb: 'This feature is on the way.' };

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={dash.BG} barStyle="dark-content" />

      <View style={Styles.header}>
        <TouchableOpacity
          style={Styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Icon name="back" size="md" color={dash.TEXT} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={Styles.headerTitle}>{route.name}</Text>
      </View>

      <View style={Styles.body}>
        <View style={Styles.iconCircle}>
          <Icon name={meta.icon} size="xxl" color={dash.BLUE} strokeWidth={1.8} />
        </View>
        <Text style={Styles.title}>Coming Soon</Text>
        <Text style={Styles.blurb}>{meta.blurb}</Text>

        <TouchableOpacity
          style={Styles.cta}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={Styles.ctaText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ComingSoon;
