import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import ConfirmModal from '../../components/confirmModal/Index';
import colors from '../../constants/colors';
import Styles from './Styles';
import { showToast } from '../../utils/toast';
import { isPayrollEnabled, setPayrollEnabled } from '../../sqlite/service/settings';

const FeatureMaster = () => {
  const [loading, setLoading] = useState(true);
  const [payrollOn, setPayrollOn] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    isPayrollEnabled().then((enabled) => {
      setPayrollOn(enabled);
      setLoading(false);
    });
  }, []);

  // Toggling only opens the confirmation modal — nothing changes until confirmed.
  const handleToggle = (next: boolean) => setPendingValue(next);

  const cancel = () => setPendingValue(null);

  const confirm = async () => {
    if (pendingValue === null) return;
    setSaving(true);
    const success = await setPayrollEnabled(pendingValue);
    setSaving(false);
    if (success) {
      setPayrollOn(pendingValue);
      showToast(pendingValue ? 'Payroll enabled' : 'Payroll disabled', 'success');
    } else {
      showToast('Failed to update feature', 'error');
    }
    setPendingValue(null);
  };

  const enabling = pendingValue === true;

  if (loading) {
    return (
      <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
        <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
        <Header title="Feature Master" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.BRAND} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Feature Master" showBack />
      <ScrollView contentContainerStyle={Styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={Styles.sectionLabel}>MODULES</Text>
        <View style={Styles.card}>
          <View style={Styles.row}>
            <View style={[Styles.rowIconChip, { backgroundColor: `${colors.ACCENT_AMBER}18` }]}>
              <Icon name="wallet" size="sm" color={colors.ACCENT_AMBER} strokeWidth={2} />
            </View>
            <View style={Styles.rowText}>
              <Text style={Styles.rowTitle}>Enable Payroll</Text>
              <Text style={Styles.rowSubtitle}>Salary, payslips & payout calculations</Text>
            </View>
            <Switch
              value={payrollOn}
              onValueChange={handleToggle}
              trackColor={{ false: colors.SURFACE_BORDER, true: `${colors.BRAND}99` }}
              thumbColor={payrollOn ? colors.BRAND : '#FFFFFF'}
              ios_backgroundColor={colors.SURFACE_BORDER}
            />
          </View>
        </View>
      </ScrollView>

      {/* On/Off confirmation modal */}
      <ConfirmModal
        visible={pendingValue !== null}
        icon="wallet"
        title={enabling ? 'Enable Payroll?' : 'Disable Payroll?'}
        message={
          enabling
            ? 'Payroll module will be turned on and become available across the app.'
            : 'Payroll module will be turned off and hidden across the app.'
        }
        confirmText={enabling ? 'Enable' : 'Disable'}
        loading={saving}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </SafeAreaView>
  );
};

export default FeatureMaster;
