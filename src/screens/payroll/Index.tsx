import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppContainer';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import colors from '../../constants/colors';
import { getPayroll, PayrollEntry } from '../../sqlite/service/payroll';
import { getOrganization } from '../../sqlite/service/organization';
import { exportPayrollToExcel } from '../../utils/exportPayroll';
import { showToast } from '../../utils/toast';
import Styles from './Styles';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const PAGE_SIZE = 12; // rows rendered per page (client-side pagination)

const pad = (n: number) => String(n).padStart(2, '0');
const monthRange = (year: number, month: number) => {
  const start = `${year}-${pad(month + 1)}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const end = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
  return { start, end };
};

const formatMoney = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;
const keyExtractor = (item: PayrollEntry) => item.uuid;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Memoized row — defined outside the screen so its identity is stable and React
// only re-renders rows whose `item`/`onPress` actually changed.
const PayrollRow = React.memo(
  ({ item, onPress }: { item: PayrollEntry; onPress: (item: PayrollEntry) => void }) => {
    const isDaily = item.salary_type === 'daily';
    return (
      <TouchableOpacity style={Styles.card} activeOpacity={0.85} onPress={() => onPress(item)}>
        <View style={Styles.avatar}>
          <Text style={Styles.avatarText}>{(item.name || '?').charAt(0).toUpperCase()}</Text>
        </View>
        <View style={Styles.info}>
          <Text style={Styles.name} numberOfLines={1}>{item.name || 'Unknown'}</Text>
          <Text style={Styles.meta}>
            {[item.employee_id ? `ID ${item.employee_id}` : null, isDaily ? 'Daily' : 'Fixed']
              .filter(Boolean)
              .join('  ·  ')}
          </Text>
          <View style={Styles.subRow}>
            <Text style={Styles.subLabel}>Present </Text>
            <Text style={Styles.subValue}>{item.present_days}d</Text>
            {isDaily ? (
              <Text style={Styles.subLabel}>  ·  {formatMoney(item.salary_amount)}/day</Text>
            ) : null}
          </View>
        </View>
        <View style={Styles.payCol}>
          <Text style={Styles.payLabel}>Payable</Text>
          <Text style={Styles.payValue}>{formatMoney(item.pay)}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const Payroll = () => {
  const navigation = useNavigation<NavigationProp>();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based
  const [list, setList] = useState<PayrollEntry[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Can't navigate past the current month (no future payroll).
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const load = useCallback(async () => {
    const { start, end } = monthRange(year, month);
    const data = await getPayroll(start, end);
    setList(data);
    setPage(1); // reset pagination for the new month
    setLoading(false);
    setRefreshing(false);
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const goPrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (isCurrentMonth) return;
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // Totals are over the FULL list (not just the rendered page).
  const totalPay = useMemo(() => list.reduce((sum, e) => sum + e.pay, 0), [list]);
  const paidCount = useMemo(() => list.filter((e) => e.pay > 0).length, [list]);

  // Client-side pagination: render only the first `page` pages; load more on scroll.
  const visible = useMemo(() => list.slice(0, page * PAGE_SIZE), [list, page]);
  const hasMore = visible.length < list.length;
  const loadMore = useCallback(() => {
    setPage((p) => (p * PAGE_SIZE < list.length ? p + 1 : p));
  }, [list.length]);

  const handleExport = async () => {
    if (exporting) return;
    if (list.length === 0) {
      showToast('No payroll to export', 'error');
      return;
    }
    setExporting(true);
    try {
      const org = await getOrganization();
      await exportPayrollToExcel(list, { year, month, monthLabel: `${MONTHS[month]} ${year}` }, org);
    } catch (error: any) {
      console.error('Payroll export error:', error);
      showToast(`Export failed: ${error?.message || error}`, 'error');
    } finally {
      setExporting(false);
    }
  };

  const openPayslip = useCallback(
    (item: PayrollEntry) => {
      navigation.navigate('Payslip', {
        uuid: item.uuid,
        year,
        month,
        presentDays: item.present_days,
        pay: item.pay,
        salaryType: item.salary_type,
        salaryAmount: item.salary_amount,
      });
    },
    [navigation, year, month],
  );

  const renderItem = useCallback(
    ({ item }: { item: PayrollEntry }) => <PayrollRow item={item} onPress={openPayslip} />,
    [openPayslip],
  );

  const renderFooter = () =>
    hasMore ? (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="small" color={colors.BRAND} />
      </View>
    ) : null;

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Payroll" showBack />

      {/* Month selector */}
      <View style={Styles.monthRow}>
        <TouchableOpacity style={Styles.monthBtn} onPress={goPrev} activeOpacity={0.7}>
          <View style={{ transform: [{ rotate: '180deg' }] }}>
            <Icon name="chevron-right" size="sm" color={colors.SURFACE_TEXT} strokeWidth={2.4} />
          </View>
        </TouchableOpacity>
        <Text style={Styles.monthLabel}>{MONTHS[month]} {year}</Text>
        <TouchableOpacity
          style={[Styles.monthBtn, isCurrentMonth && Styles.monthBtnDisabled]}
          onPress={goNext}
          disabled={isCurrentMonth}
          activeOpacity={0.7}
        >
          <Icon name="chevron-right" size="sm" color={isCurrentMonth ? colors.SURFACE_TEXT_MUTED : colors.SURFACE_TEXT} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* Total payout summary */}
      <View style={Styles.summary}>
        <View>
          <Text style={Styles.summaryLabel}>Total Payable</Text>
          <Text style={Styles.summaryValue}>{formatMoney(totalPay)}</Text>
        </View>
        <View style={Styles.summaryRight}>
          <Text style={Styles.summaryLabel}>Employees</Text>
          <Text style={Styles.summaryCount}>{paidCount}/{list.length}</Text>
        </View>
      </View>

      {/* Export */}
      <View style={Styles.exportRow}>
        <TouchableOpacity
          style={[Styles.exportBtn, exporting && { opacity: 0.6 }]}
          onPress={handleExport}
          disabled={exporting}
          activeOpacity={0.85}
        >
          {exporting ? (
            <ActivityIndicator size="small" color={colors.BRAND} />
          ) : (
            <Icon name="download" size="sm" color={colors.BRAND} strokeWidth={2.2} />
          )}
          <Text style={Styles.exportBtnText}>Export to Excel</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={visible}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={list.length === 0 ? Styles.emptyContainer : Styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        initialNumToRender={PAGE_SIZE}
        maxToRenderPerBatch={PAGE_SIZE}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={() =>
          loading ? (
            <View style={Styles.emptyContainer}>
              <ActivityIndicator size="large" color={colors.BRAND} />
              <Text style={Styles.emptyText}>Loading payroll…</Text>
            </View>
          ) : (
            <View style={Styles.emptyContainer}>
              <Text style={Styles.emptyIcon}>💰</Text>
              <Text style={Styles.emptyText}>No employees found</Text>
              <Text style={Styles.emptySubtext}>Add users with salary details to see payroll</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Payroll;
