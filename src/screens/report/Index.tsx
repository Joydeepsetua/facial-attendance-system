import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, SectionList, RefreshControl, ActivityIndicator, TextInput, TouchableOpacity, Platform, StatusBar, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Header from '../../components/header/Index';
import { getAttendanceRoster, RosterEntry, RosterStatus } from '../../sqlite/service/attendance';
import Styles from './Styles';
import colors from '../../constants/colors';
import Icon from '../../components/icons/Index';
import { AppIconName } from '../../components/icons/icons';

type DatePreset = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

const STATUS_OPTIONS: { key: RosterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'present', label: 'Present' },
  { key: 'absent', label: 'Absent' },
];

const DATE_OPTIONS: { key: DatePreset; label: string; icon: AppIconName }[] = [
  { key: 'today', label: 'Today', icon: 'calendar' },
  { key: 'yesterday', label: 'Yesterday', icon: 'clock' },
  { key: 'week', label: 'This Week', icon: 'chart-no-axes-combined' },
  { key: 'month', label: 'This Month', icon: 'calendar' },
  { key: 'custom', label: 'Custom', icon: 'calendar' },
];

// Inactive dot colour per status for the filter chips.
const STATUS_DOT_STYLE: Record<RosterStatus, object> = {
  all: Styles.chipDotAll,
  present: Styles.statusDotPresent,
  absent: Styles.statusDotAbsent,
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const formatTime = (dateString?: string) => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const calculateHours = (punchIn?: string, punchOut?: string) => {
  if (!punchIn || !punchOut) return null;
  const diffHours = (new Date(punchOut).getTime() - new Date(punchIn).getTime()) / (1000 * 60 * 60);
  const hours = Math.floor(diffHours);
  const minutes = Math.floor((diffHours - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Display a 'YYYY-MM-DD' day string as 'DD MON YYYY' (no timezone shift).
const formatDayHeader = (dayStr: string): string => {
  const [y, m, d] = dayStr.split('-');
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
};

const formatPickerDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS[date.getMonth()];
  return `${day} ${month.charAt(0)}${month.slice(1).toLowerCase()} ${date.getFullYear()}`;
};

const addDays = (date: Date, n: number): Date => {
  const x = new Date(date);
  x.setDate(x.getDate() + n);
  return x;
};

// Monday-based start of the week.
const startOfWeek = (date: Date): Date => {
  const x = new Date(date);
  const offset = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - offset);
  return x;
};

// Resolve an applied filter into [startDate, endDate] day strings.
const resolveRange = (
  preset: DatePreset,
  customStart: Date | null,
  customEnd: Date | null,
): { start: string; end: string } => {
  const today = new Date();
  switch (preset) {
    case 'yesterday': {
      const y = addDays(today, -1);
      return { start: toDateString(y), end: toDateString(y) };
    }
    case 'week':
      return { start: toDateString(startOfWeek(today)), end: toDateString(today) };
    case 'month':
      return { start: toDateString(new Date(today.getFullYear(), today.getMonth(), 1)), end: toDateString(today) };
    case 'custom':
      if (customStart && customEnd) {
        return { start: toDateString(customStart), end: toDateString(customEnd) };
      }
      return { start: toDateString(today), end: toDateString(today) };
    case 'today':
    default:
      return { start: toDateString(today), end: toDateString(today) };
  }
};

interface RosterSection {
  title: string;
  data: RosterEntry[];
}

const groupByDay = (data: RosterEntry[]): RosterSection[] => {
  const grouped: { [day: string]: RosterEntry[] } = {};
  data.forEach((item) => {
    if (!grouped[item.day]) grouped[item.day] = [];
    grouped[item.day].push(item);
  });
  return Object.keys(grouped).map((day) => ({ title: formatDayHeader(day), data: grouped[day] }));
};

const renderRosterItem = ({ item }: { item: RosterEntry }) => {
  const present = item.status === 'present';
  const hours = calculateHours(item.punch_in, item.punch_out);

  return (
    <View style={Styles.attendanceCard}>
      <View style={Styles.attendanceAvatar}>
        <Text style={Styles.attendanceAvatarText}>{item.user_name?.charAt(0).toUpperCase() || '?'}</Text>
      </View>
      <View style={Styles.attendanceInfo}>
        <View style={Styles.nameRow}>
          <Text style={Styles.attendanceUserName} numberOfLines={1}>{item.user_name || 'Unknown User'}</Text>
          <View style={[Styles.statusBadge, present ? Styles.statusBadgePresent : Styles.statusBadgeAbsent]}>
            <View style={[Styles.statusDot, present ? Styles.statusDotPresent : Styles.statusDotAbsent]} />
            <Text style={[Styles.statusText, present ? Styles.statusTextPresent : Styles.statusTextAbsent]}>
              {present ? 'Present' : 'Absent'}
            </Text>
          </View>
        </View>

        {(item.user_employee_id || item.user_phone) ? (
          <Text style={Styles.attendanceUserMeta}>
            {[item.user_employee_id ? `ID ${item.user_employee_id}` : null, item.user_phone || null]
              .filter(Boolean)
              .join('  ·  ')}
          </Text>
        ) : null}

        <View style={Styles.statsRow}>
          <View style={Styles.statColumn}>
            <Text style={Styles.statLabel}>In Time</Text>
            <Text style={Styles.statValue}>{formatTime(item.punch_in)}</Text>
          </View>
          <View style={Styles.arrowContainer}><Text style={Styles.arrowText}>→</Text></View>
          <View style={Styles.statColumn}>
            <Text style={Styles.statLabel}>Out Time</Text>
            <Text style={Styles.statValue}>{item.punch_out ? formatTime(item.punch_out) : '--:--'}</Text>
          </View>
          <View style={Styles.dividerVertical} />
          <View style={Styles.statColumn}>
            <Text style={Styles.statLabel}>Total</Text>
            <Text style={Styles.statValue}>{hours || '--:--'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const renderEmptyComponent = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <View style={Styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.BRAND} />
        <Text style={Styles.emptyText}>Loading attendance records...</Text>
      </View>
    );
  }
  return (
    <View style={Styles.emptyContainer}>
      <Text style={Styles.emptyIcon}>👥</Text>
      <Text style={Styles.emptyText}>No records found</Text>
      <Text style={Styles.emptySubtext}>No records for the selected date range</Text>
    </View>
  );
};

const keyExtractor = (item: RosterEntry) => `${item.day}_${item.user_id}`;

const Report = () => {
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Search
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Applied filters
  const [statusFilter, setStatusFilter] = useState<RosterStatus>('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('today');
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);

  // Filter sheet (draft state — only committed on Apply)
  const [sheetVisible, setSheetVisible] = useState(false);
  const [draftStatus, setDraftStatus] = useState<RosterStatus>('all');
  const [draftPreset, setDraftPreset] = useState<DatePreset>('today');
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const limit = 20;

  const { start: startDate, end: endDate } = resolveRange(datePreset, customStart, customEnd);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => setDebouncedSearch(searchText), 500);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchText]);

  const fetchRoster = async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const page = isLoadMore ? currentPage + 1 : 1;
      const response = await getAttendanceRoster(startDate, endDate, statusFilter, debouncedSearch, limit, page);
      const { data, pagination } = response;
      setCurrentPage(pagination.currentPage);
      setHasMore(pagination.currentPage < pagination.totalPages);
      setRoster((prev) => (isLoadMore ? [...prev, ...data] : data));
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoster(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, statusFilter, startDate, endDate])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoster(false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) fetchRoster(true);
  };

  const openSheet = () => {
    setDraftStatus(statusFilter);
    setDraftPreset(datePreset);
    setDraftStart(customStart);
    setDraftEnd(customEnd);
    setSheetVisible(true);
  };

  const applyFilters = () => {
    setStatusFilter(draftStatus);
    setDatePreset(draftPreset);
    if (draftPreset === 'custom') {
      setCustomStart(draftStart);
      setCustomEnd(draftEnd);
    }
    setSheetVisible(false);
  };

  const resetFilters = () => {
    setDraftStatus('all');
    setDraftPreset('today');
    setDraftStart(null);
    setDraftEnd(null);
  };

  const onStartChange = (_e: DateTimePickerEvent, date?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (date) setDraftStart(date);
  };
  const onEndChange = (_e: DateTimePickerEvent, date?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (date) setDraftEnd(date);
  };

  const filtersActive = statusFilter !== 'all' || datePreset !== 'today';
  const customReady = draftPreset !== 'custom' || (draftStart !== null && draftEnd !== null);

  const groupedRoster = groupByDay(roster);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={colors.BRAND} />
      </View>
    );
  };

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Attendance Report" showBack />
      <View style={Styles.content}>
        <View style={Styles.filterContainer}>
          <View style={Styles.searchRow}>
            <View style={[Styles.searchContainer, { flex: 1 }]}>
              <TextInput
                style={Styles.searchInputField}
                placeholder="Search by name..."
                placeholderTextColor={colors.SURFACE_TEXT_MUTED}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity style={Styles.searchClearButton} onPress={() => setSearchText('')}>
                  <Icon name="close" size="sm" color={colors.SURFACE_TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[Styles.filterButton, filtersActive && Styles.filterButtonActive]}
              onPress={openSheet}
              activeOpacity={0.85}
            >
              <Icon name="sliders" size="sm" color={filtersActive ? colors.BRAND : colors.SURFACE_TEXT_MUTED} />
              {filtersActive && <View style={Styles.filterDot} />}
            </TouchableOpacity>
          </View>
        </View>

        <SectionList
          sections={groupedRoster}
          renderItem={renderRosterItem}
          ListFooterComponent={renderFooter}
          renderSectionHeader={({ section: { title } }) => (
            <View style={Styles.sectionHeaderContainer}>
              <View style={Styles.headerLine} />
              <Text style={Styles.sectionHeaderText}>{title}</Text>
              <View style={Styles.headerLine} />
            </View>
          )}
          keyExtractor={keyExtractor}
          contentContainerStyle={roster.length === 0 ? Styles.listContainer : Styles.listContent}
          ListEmptyComponent={() => renderEmptyComponent({ loading })}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>

      {/* Filter bottom sheet */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <Pressable style={Styles.sheetOverlay} onPress={() => setSheetVisible(false)}>
          <Pressable style={Styles.sheet}>
            <View style={Styles.sheetHandle} />
            <View style={Styles.sheetHeader}>
              <Text style={Styles.sheetTitle}>Filters</Text>
              <TouchableOpacity style={Styles.sheetClose} activeOpacity={0.7} onPress={() => setSheetVisible(false)}>
                <Icon name="close" size="sm" color={colors.SURFACE_TEXT_MUTED} strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            <Text style={Styles.sheetSectionLabel}>STATUS</Text>
            <View style={Styles.chipsWrap}>
              {STATUS_OPTIONS.map((opt) => {
                const active = draftStatus === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[Styles.chip, active && Styles.chipActive]}
                    activeOpacity={0.85}
                    onPress={() => setDraftStatus(opt.key)}
                  >
                    {active ? (
                      <Icon name="check" size="xs" color={colors.BRAND} strokeWidth={3} />
                    ) : (
                      <View style={[Styles.statusDot, STATUS_DOT_STYLE[opt.key]]} />
                    )}
                    <Text style={[Styles.chipText, active && Styles.chipTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={Styles.sheetDivider} />

            <Text style={Styles.sheetSectionLabel}>DATE RANGE</Text>
            <View style={Styles.chipsWrap}>
              {DATE_OPTIONS.map((opt) => {
                const active = draftPreset === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[Styles.chip, active && Styles.chipActive]}
                    activeOpacity={0.85}
                    onPress={() => setDraftPreset(opt.key)}
                  >
                    <Icon name={opt.icon} size="xs" color={active ? colors.BRAND : colors.SURFACE_TEXT_MUTED} strokeWidth={2.2} />
                    <Text style={[Styles.chipText, active && Styles.chipTextActive]}>{opt.label}</Text>
                    {active && (
                      <View style={Styles.chipCheckCircle}>
                        <Icon name="check" size="xxs" color="#FFFFFF" strokeWidth={3.2} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {draftPreset === 'custom' && (
              <View style={Styles.customRange}>
                <View style={Styles.customField}>
                  <Text style={Styles.customFieldLabel}>From</Text>
                  <TouchableOpacity
                    style={[Styles.searchInput, Styles.datePickerButton]}
                    onPress={() => setShowStartPicker(true)}
                  >
                    <Icon name="calendar" size="sm" color={draftStart ? colors.BRAND : colors.SURFACE_TEXT_MUTED} />
                    <Text style={[draftStart ? Styles.datePickerText : Styles.datePickerPlaceholder, { flex: 1 }]}>
                      {draftStart ? formatPickerDate(draftStart) : 'Start date'}
                    </Text>
                    <Icon name="chevron-down" size="xs" color={colors.SURFACE_TEXT_MUTED} strokeWidth={2.2} />
                  </TouchableOpacity>
                </View>
                <Text style={Styles.customDash}>–</Text>
                <View style={Styles.customField}>
                  <Text style={Styles.customFieldLabel}>To</Text>
                  <TouchableOpacity
                    style={[Styles.searchInput, Styles.datePickerButton]}
                    onPress={() => setShowEndPicker(true)}
                  >
                    <Icon name="calendar" size="sm" color={draftEnd ? colors.BRAND : colors.SURFACE_TEXT_MUTED} />
                    <Text style={[draftEnd ? Styles.datePickerText : Styles.datePickerPlaceholder, { flex: 1 }]}>
                      {draftEnd ? formatPickerDate(draftEnd) : 'End date'}
                    </Text>
                    <Icon name="chevron-down" size="xs" color={colors.SURFACE_TEXT_MUTED} strokeWidth={2.2} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {showStartPicker && (
              <DateTimePicker
                value={draftStart || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onStartChange}
                maximumDate={draftEnd || new Date()}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                value={draftEnd || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onEndChange}
                minimumDate={draftStart || undefined}
                maximumDate={new Date()}
              />
            )}

            <View style={Styles.sheetActions}>
              <TouchableOpacity style={Styles.resetButton} activeOpacity={0.85} onPress={resetFilters}>
                <Icon name="retake" size="sm" color={colors.SURFACE_TEXT} strokeWidth={2.2} />
                <Text style={Styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.applyButton, !customReady && { opacity: 0.5 }]}
                activeOpacity={0.85}
                onPress={applyFilters}
                disabled={!customReady}
              >
                <Icon name="sliders" size="sm" color="#FFFFFF" strokeWidth={2.2} />
                <Text style={Styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Report;
