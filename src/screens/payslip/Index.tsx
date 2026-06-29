import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import colors from '../../constants/colors';
import { RootStackParamList } from '../../navigation/AppContainer';
import { getUserByUuid, User } from '../../sqlite/service/user';
import { getOrganization, Organization } from '../../sqlite/service/organization';
import { rupeesInWords } from '../../utils/numberToWords';
import { sharePayslipPdf } from '../../utils/payslipPdf';
import { showToast } from '../../utils/toast';
import Styles from './Styles';

type PayslipRoute = RouteProp<RootStackParamList, 'Payslip'>;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const money = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;
const dash = (s?: string | null) => (s && String(s).trim() ? s : '—');

// One "Label : Value" row in a two-column grid.
const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <View style={Styles.field}>
    <Text style={Styles.fieldLabel}>{label}</Text>
    <Text style={Styles.fieldValue} numberOfLines={1}>{dash(value)}</Text>
  </View>
);

const Payslip = () => {
  const { params } = useRoute<PayslipRoute>();
  const { uuid, year, month, presentDays, pay, salaryType, salaryAmount } = params;

  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    (async () => {
      const [u, o] = await Promise.all([getUserByUuid(uuid), getOrganization()]);
      setUser(u);
      setOrg(o);
      setLoading(false);
    })();
  }, [uuid]);

  const totalDays = new Date(year, month + 1, 0).getDate();
  const present = presentDays;
  const absent = Math.max(totalDays - present, 0);
  const isDaily = salaryType === 'daily';
  // Daily: paid for days present. Fixed: full month paid regardless of attendance.
  const paidDays = isDaily ? present : totalDays;
  const monthLabel = `${MONTHS[month]} ${year}`;

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await sharePayslipPdf({
        user, org, monthLabel, totalDays, paidDays, present, absent,
        isDaily, salaryAmount, pay,
      });
    } catch (error: any) {
      console.error('Payslip PDF error:', error);
      showToast(`Share failed: ${error?.message || error}`, 'error');
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
        <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
        <Header title="Payslip" showBack />
        <View style={Styles.loading}>
          <ActivityIndicator size="large" color={colors.BRAND} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Payslip" showBack />
      <ScrollView contentContainerStyle={Styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={Styles.sheet}>
          {/* Company header — letterhead style (logo left, details beside) */}
          <View style={Styles.companyHeader}>
            {org?.logo ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${org.logo}` }}
                style={Styles.companyLogo}
                resizeMode="contain"
              />
            ) : null}
            <View style={Styles.companyInfo}>
              <Text style={Styles.companyName}>{dash(org?.name) === '—' ? 'Company Name' : org?.name}</Text>
              {org?.address ? <Text style={Styles.companyMeta}>{org.address}</Text> : null}
              {(org?.phone || org?.email) ? (
                <Text style={Styles.companyMeta}>
                  {[org?.phone, org?.email].filter(Boolean).join('  ·  ')}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={Styles.divider} />

          <Text style={Styles.payslipTitle}>Payslip</Text>
          <Text style={Styles.payslipMonth}>For the month of {monthLabel}</Text>

          {/* Employee details */}
          <Text style={Styles.sectionLabel}>EMPLOYEE DETAILS</Text>
          <View style={Styles.grid}>
            <Field label="Name" value={user?.name} />
            <Field label="Employee ID" value={user?.employee_id} />
            <Field label="PAN" value={user?.pan} />
            <Field label="UAN" value={user?.uan} />
            <Field label="PF No." value={user?.pf} />
            <Field label="ESI No." value={user?.esi} />
            <Field label="Bank A/C" value={user?.bank_account} />
            <Field label="IFSC" value={user?.ifsc} />
          </View>

          {/* Attendance */}
          <Text style={Styles.sectionLabel}>ATTENDANCE</Text>
          <View style={Styles.grid}>
            <Field label="Total Days" value={String(totalDays)} />
            <Field label="Paid Days" value={String(paidDays)} />
            <Field label="Present" value={String(present)} />
            <Field label="LOP / Absent" value={String(absent)} />
          </View>

          {/* Earnings */}
          <Text style={Styles.sectionLabel}>EARNINGS</Text>
          <View style={Styles.earnRow}>
            <Text style={Styles.earnLabel}>
              {isDaily ? `Wages (${present} × ${money(salaryAmount)})` : 'Basic Salary'}
            </Text>
            <Text style={Styles.earnValue}>{money(pay)}</Text>
          </View>
          <View style={[Styles.earnRow, Styles.grossRow]}>
            <Text style={Styles.grossLabel}>Gross Earnings</Text>
            <Text style={Styles.grossValue}>{money(pay)}</Text>
          </View>

          {/* Net pay */}
          <View style={Styles.netBox}>
            <View style={Styles.netTop}>
              <Text style={Styles.netLabel}>Net Pay</Text>
              <Text style={Styles.netValue}>{money(pay)}</Text>
            </View>
            <Text style={Styles.netWords}>{rupeesInWords(pay)}</Text>
          </View>

          <Text style={Styles.footer}>
            This is a computer-generated payslip and does not require a signature.
          </Text>
        </View>
      </ScrollView>

      {/* Share as PDF */}
      <View style={Styles.shareBar}>
        <TouchableOpacity
          style={[Styles.shareBtn, sharing && { opacity: 0.6 }]}
          onPress={handleShare}
          disabled={sharing}
          activeOpacity={0.85}
        >
          {sharing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Icon name="download" size="sm" color="#FFFFFF" strokeWidth={2.2} />
          )}
          <Text style={Styles.shareBtnText}>Share Payslip (PDF)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Payslip;
