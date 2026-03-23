import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, SectionList, RefreshControl, ActivityIndicator, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Header from '../../components/header/Index';
import { getAllAttendance, Attendance } from '../../sqlite/service/attendance';
import Styles from './Styles';
import colors from '../../constants/colors';
import SafeAreaWrapper from '../../wrappers/SafeAreaWrapper';
import Icon from '../../components/icons/Index';

const formatTime = (dateString?: string) => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const calculateHours = (punchIn?: string, punchOut?: string) => {
  if (!punchIn || !punchOut) return null;
  const inTime = new Date(punchIn).getTime();
  const outTime = new Date(punchOut).getTime();
  const diffHours = (outTime - inTime) / (1000 * 60 * 60);
  
  const hours = Math.floor(diffHours);
  const minutes = Math.floor((diffHours - hours) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

interface AttendanceSection {
  title: string;
  data: Attendance[];
}

const groupAttendanceByDate = (data: Attendance[]): AttendanceSection[] => {
  if (!data || data.length === 0) return [];

  const grouped: { [key: string]: Attendance[] } = {};
  
  data.forEach((item) => {
    const dateToUse = item.punch_in || item.created_at;
    const dateStr = formatDate(dateToUse);
    
    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }
    grouped[dateStr].push(item);
  });
  
  return Object.keys(grouped).map(date => ({
    title: date,
    data: grouped[date]
  }));
};

const renderAttendanceItem = ({ item }: { item: Attendance }) => {
  const hours = calculateHours(item.punch_in, item.punch_out);

  return (
    <View style={Styles.attendanceCard}>
      <View style={Styles.attendanceAvatar}>
        {/* We can use an outlined circle or icon to match the UI later, 
            for now keeping the initial avatar but changing styles in Styles.tsx */}
        <Text style={Styles.attendanceAvatarText}>
          {item.user_name?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
      <View style={Styles.attendanceInfo}>
        <Text style={Styles.attendanceUserName}>{item.user_name || 'Unknown User'}</Text>
        
        <View style={Styles.statsRow}>
          <View style={Styles.statColumn}>
            <Text style={Styles.statLabel}>In Time</Text>
            <Text style={Styles.statValue}>{formatTime(item.punch_in)}</Text>
          </View>
          
          <View style={Styles.arrowContainer}>
            <Text style={Styles.arrowText}>→</Text>
          </View>
          
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
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={Styles.emptyText}>Loading attendance records...</Text>
      </View>
    );
  }
  return (
    <View style={Styles.emptyContainer}>
      <Text style={Styles.emptyIcon}>📊</Text>
      <Text style={Styles.emptyText}>No attendance records found</Text>
      <Text style={Styles.emptySubtext}>
        Attendance records will appear here after marking attendance
      </Text>
    </View>
  );
};

const keyExtractor = (item: Attendance) => item.id;

const Report = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDateObj, setStartDateObj] = useState<Date | null>(null);
  const [endDateObj, setEndDateObj] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const limit = 20;

  // Debounce search input
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchText]);

  const fetchAttendance = async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const page = isLoadMore ? currentPage + 1 : 1;
      const response = await getAllAttendance(debouncedSearch, startDate, endDate, limit, page);
      const { data: newLogs, pagination } = response;

      setCurrentPage(pagination.currentPage);
      setHasMore(pagination.currentPage < pagination.totalPages);

      if (isLoadMore) {
        setAttendance(prev => [...prev, ...newLogs]);
      } else {
        setAttendance(newLogs);
      }
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
      fetchAttendance(false);
    }, [debouncedSearch, startDate, endDate])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance(false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchAttendance(true);
    }
  };

  const toDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const onStartDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDateObj(selectedDate);
      setStartDate(toDateString(selectedDate));
    }
  };

  const onEndDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDateObj(selectedDate);
      setEndDate(toDateString(selectedDate));
    }
  };

  const clearDateFilters = () => {
    setStartDateObj(null);
    setEndDateObj(null);
    setStartDate('');
    setEndDate('');
  };

  const groupedAttendance = groupAttendanceByDate(attendance);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={colors.PRIMARY} />
      </View>
    );
  };

  return (
    <SafeAreaWrapper>
      <Header title="Attendance Report" showBack />
      <View style={Styles.content}>
        <View style={Styles.filterContainer}>
          <TextInput
            style={Styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor={colors.TEXT_SECONDARY}
            value={searchText}
            onChangeText={setSearchText}
          />

          <View style={Styles.dateFilterRow}>
            <TouchableOpacity
              style={[Styles.searchInput, Styles.dateInput, Styles.datePickerButton]}
              onPress={() => setShowStartPicker(true)}>
              <Icon name="calendar" size="sm" color={startDateObj ? colors.PRIMARY : colors.TEXT_SECONDARY} />
              <Text style={startDateObj ? Styles.datePickerText : Styles.datePickerPlaceholder}>
                {startDateObj ? formatDisplayDate(startDateObj) : 'Start Date'}
              </Text>
            </TouchableOpacity>

            <View style={Styles.dateArrowContainer}>
              <Icon name="arrow-left-right" size="sm" color={colors.TEXT_SECONDARY} />
            </View>

            <TouchableOpacity
              style={[Styles.searchInput, Styles.dateInput, Styles.datePickerButton]}
              onPress={() => setShowEndPicker(true)}>
              <Icon name="calendar" size="sm" color={endDateObj ? colors.PRIMARY : colors.TEXT_SECONDARY} />
              <Text style={endDateObj ? Styles.datePickerText : Styles.datePickerPlaceholder}>
                {endDateObj ? formatDisplayDate(endDateObj) : 'End Date'}
              </Text>
            </TouchableOpacity>
          </View>

          {(startDateObj || endDateObj) && (
            <TouchableOpacity style={Styles.clearButton} onPress={clearDateFilters}>
              <Text style={Styles.clearButtonText}>Clear Dates</Text>
            </TouchableOpacity>
          )}

          {showStartPicker && (
            <DateTimePicker
              value={startDateObj || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onStartDateChange}
              maximumDate={endDateObj || new Date()}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDateObj || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onEndDateChange}
              minimumDate={startDateObj || undefined}
              maximumDate={new Date()}
            />
          )}
        </View>

        <SectionList
          sections={groupedAttendance}
          renderItem={renderAttendanceItem}
          ListFooterComponent={renderFooter}
          renderSectionHeader={({ section: { title } }) => (
            <View style={Styles.sectionHeaderContainer}>
              <View style={Styles.headerLine} />
              <Text style={Styles.sectionHeaderText}>{title}</Text>
              <View style={Styles.headerLine} />
            </View>
          )}
          keyExtractor={keyExtractor}
          contentContainerStyle={attendance.length === 0 ? Styles.listContainer : Styles.listContent}
          ListEmptyComponent={() => renderEmptyComponent({ loading })}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default Report;
