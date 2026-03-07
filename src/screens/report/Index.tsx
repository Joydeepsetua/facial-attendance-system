import React, { useState, useCallback } from 'react';
import { View, Text, SectionList, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/header/Index';
import { getAllAttendance, Attendance } from '../../sqlite/service/attendance';
import Styles from './Styles';
import colors from '../../constants/colors';
import SafeAreaWrapper from '../../wrappers/SafeAreaWrapper';

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendance = async () => {
    try {
      const attendanceList = await getAllAttendance();
      setAttendance(attendanceList);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAttendance();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const groupedAttendance = groupAttendanceByDate(attendance);

  return (
    <SafeAreaWrapper>
      <Header title="Attendance Report" showBack />
      <View style={Styles.content}>
        <SectionList
          sections={groupedAttendance}
          renderItem={renderAttendanceItem}
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
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default Report;
