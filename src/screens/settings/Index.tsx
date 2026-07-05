import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import { AppIconName } from '../../components/icons/icons';
import colors from '../../constants/colors';
import { showToast } from '../../utils/toast';
import { RootStackParamList } from '../../navigation/AppContainer';
import Styles from './Styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingsItem {
  key: string;
  label: string;
  icon: AppIconName;
  route?: keyof RootStackParamList;
  params?: object;
  action?: 'rate';
  danger?: boolean;
}

const PLAY_STORE_ID = 'com.facialattendance'; // matches android applicationId

const openStoreForRating = async () => {
  const webUrl = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;
  try {
    await Linking.openURL(webUrl);
  } catch {
    showToast('Could not open the store', 'error');
  }
};

// Whole list is driven by this array — add/remove/reorder rows here.
const SETTINGS_ITEMS: SettingsItem[] = [
  // { key: 'appearance', label: 'Appearance', icon: 'eye' },
  // { key: 'privacy', label: 'Privacy & Security', icon: 'lock' },
  // { key: 'help', label: 'Help and Support', icon: 'headphones' },
  // { key: 'about', label: 'About', icon: 'help' },
  { key: 'organization', label: 'Organization Update', icon: 'building', route: 'Organization' },
  { key: 'features', label: 'Feature Master', icon: 'sliders', route: 'FeatureMaster' },
  { key: 'privacy', label: 'Privacy Policy', icon: 'lock', route: 'Legal', params: { type: 'privacy' } },
  { key: 'terms', label: 'Terms & Conditions', icon: 'report', route: 'Legal', params: { type: 'terms' } },
  { key: 'feedback', label: 'Send Feedback', icon: 'feedback', route: 'Feedback' },
  { key: 'rate', label: 'Rate Us', icon: 'star', action: 'rate' },
  { key: 'about', label: 'About', icon: 'help', route: 'About' },
  // { key: 'logout', label: 'Logout', icon: 'logout', danger: true },
];

const Settings = () => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (item: SettingsItem) => {
    if (item.action === 'rate') {
      openStoreForRating();
    } else if (item.route) {
      (navigation.navigate as any)(item.route, item.params);
    } else {
      showToast(`${item.label} — coming soon`, 'success');
    }
  };

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Settings" showBack />
      <ScrollView contentContainerStyle={Styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={Styles.card}>
          {SETTINGS_ITEMS.map((item, index) => {
            const tint = item.danger ? colors.RED : colors.SURFACE_TEXT;
            return (
              <TouchableOpacity
                key={item.key}
                style={[Styles.row, index > 0 ? Styles.rowDivider : null]}
                activeOpacity={0.7}
                onPress={() => handlePress(item)}
              >
                <View style={Styles.rowIcon}>
                  <Icon name={item.icon} size="md" color={tint} strokeWidth={2} />
                </View>
                <Text style={[Styles.rowLabel, item.danger ? Styles.rowLabelDanger : null]}>
                  {item.label}
                </Text>
                {!item.danger && (
                  <Icon name="chevron-right" size="sm" color={colors.SURFACE_TEXT_MUTED} strokeWidth={2.2} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
