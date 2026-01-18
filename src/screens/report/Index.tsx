import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/header/Index';
import { getAllAttendance, Attendance } from '../../sqlite/service/attendance';
import Styles from './Styles';
import colors from '../../utils/colors';

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const renderAttendanceItem = ({ item }: { item: Attendance }) => {
  return (
    <View style={Styles.attendanceCard}>
      <View style={Styles.attendanceAvatar}>
        <Text style={Styles.attendanceAvatarText}>
          {item.user_name?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
      <View style={Styles.attendanceInfo}>
        <Text style={Styles.attendanceUserName}>{item.user_name || 'Unknown User'}</Text>
        <Text style={Styles.attendanceDateTime}>
          {formatDateTime(item.created_at)}
        </Text>
      </View>
      <View style={Styles.attendanceStatus}>
        <Text style={Styles.attendanceStatusIcon}>✓</Text>
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
      <Text style={Styles.emptySubtext}>Attendance records will appear here after marking attendance</Text>
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
      console.log(attendanceList);
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

  return (
    <SafeAreaView style={Styles.container} edges={['bottom', 'left', 'right']}>
      <Header title="Attendance Report" showBack />
      <View style={Styles.content}>
        <FlatList
          data={attendance}
          renderItem={renderAttendanceItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={attendance.length === 0 ? Styles.listContainer : Styles.listContent}
          ListEmptyComponent={() => renderEmptyComponent({ loading })}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Report;
