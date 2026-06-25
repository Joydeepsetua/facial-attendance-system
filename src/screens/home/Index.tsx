import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  InteractionManager,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppContainer';
import Styles, { dash } from './Styles';
import colors from '../../constants/colors';
import { createTable } from '../../sqlite';
import { getAllUsers } from '../../sqlite/service/user';
import { getAllAttendance } from '../../sqlite/service/attendance';
import { runMarkAttendance, AttendanceOutcome } from '../../utils/markAttendance';
import { showToast } from '../../utils/toast';
import Icon from '../../components/icons/Index';
import { AppIconName } from '../../components/icons/icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Action {
  key: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  accent: string;
  onPress: () => void;
}

interface Stat {
  key: string;
  value: number;
  label: string;
  icon: AppIconName;
  accent: string;
}

const todayString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const longDate = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({ users: 0, today: 0 });
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AttendanceOutcome | null>(null);
  const absent = Math.max(stats.users - stats.today, 0);

  // Defer DB init off the entry transition (tables are pre-created on splash).
  React.useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      createTable().catch((error) => {
        console.error('Error initializing database:', error);
      });
    });
    return () => task.cancel();
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const users = await getAllUsers();
      const today = todayString();
      const att = await getAllAttendance('', today, today, 1, 1);
      setStats({ users: users.length, today: att.pagination.totalCount });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }, []);

  // Refresh stats whenever the dashboard regains focus.
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats]),
  );

  // Run the whole attendance flow right here — camera opens directly, result
  // shows in a popup, and we stay on the dashboard (no separate screen).
  const handleMarkAttendance = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    const outcome = await runMarkAttendance();
    setScanning(false);
    if (outcome.type === 'cancelled') return;
    setResult(outcome);
    if (outcome.type === 'success') {
      showToast(outcome.message, 'success');
      loadStats();
    } else {
      showToast(outcome.message, 'error');
    }
  }, [scanning, loadStats]);

  const overview: Stat[] = [
    { key: 'users', value: stats.users, label: 'Total Users', icon: 'users', accent: colors.ACCENT_BLUE },
    { key: 'present', value: stats.today, label: 'Present', icon: 'user-check', accent: colors.ACCENT_GREEN },
    { key: 'absent', value: absent, label: 'Absent', icon: 'user-x', accent: colors.RED },
  ];

  const actions: Action[] = [
    {
      key: 'attendance',
      title: 'Mark Attendance',
      subtitle: 'Face scan check-in',
      icon: 'camera',
      accent: colors.ACCENT_BLUE,
      onPress: handleMarkAttendance,
    },
    {
      key: 'addUser',
      title: 'Add User',
      subtitle: 'Register employee',
      icon: 'user-plus',
      accent: colors.ACCENT_VIOLET,
      onPress: () => navigation.navigate('CreateUser'),
    },
    {
      key: 'users',
      title: 'Manage Users',
      subtitle: 'View & edit',
      icon: 'users',
      accent: colors.ACCENT_GREEN,
      onPress: () => navigation.navigate('Users'),
    },
    {
      key: 'reports',
      title: 'Reports',
      subtitle: 'Attendance records',
      icon: 'report',
      accent: colors.ACCENT_ORANGE,
      onPress: () => navigation.navigate('Report'),
    },
    {
      key: 'payroll',
      title: 'Payroll',
      subtitle: 'Salary & payouts',
      icon: 'wallet',
      accent: colors.ACCENT_AMBER,
      onPress: () => navigation.navigate('Payroll'),
    },
    {
      key: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: 'settings',
      accent: colors.ACCENT_SLATE,
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  return (
    <SafeAreaView style={Styles.screen} edges={['bottom']}>
      <StatusBar backgroundColor={dash.BLUE} barStyle="light-content" />
      <ScrollView
        contentContainerStyle={Styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header banner — blue extends behind the status bar */}
        <View style={[Styles.banner, { paddingTop: insets.top + 18 }]}>
          <Text style={Styles.greeting}>Welcome to</Text>
          <Text style={Styles.appName}>FaceTen</Text>
          <Text style={Styles.dateText}>{longDate()}</Text>
        </View>

        {/* Today's overview */}
        <Text style={Styles.sectionTitle}>Today's Overview</Text>
        <View style={Styles.overviewCard}>
          {overview.map((stat, index) => (
            <React.Fragment key={stat.key}>
              {index > 0 && <View style={Styles.statDivider} />}
              <View style={Styles.statCol}>
                <Text style={[Styles.statValue, { color: stat.accent }]}>{stat.value}</Text>
                <Text style={[Styles.statLabel, { color: stat.accent }]}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={Styles.sectionTitle}>Quick Actions</Text>
        <View style={Styles.grid}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={Styles.actionCard}
              activeOpacity={0.85}
              onPress={action.onPress}
            >
              <View
                style={[
                  Styles.actionIconWrap,
                  { backgroundColor: `${action.accent}18` },
                ]}
              >
                <Icon name={action.icon} size="lg" color={action.accent} strokeWidth={2} />
              </View>
              <Text style={Styles.actionTitle}>{action.title}</Text>
              <Text style={Styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Scanning / processing overlay */}
      <Modal visible={scanning} transparent animationType="fade">
        <View style={Styles.modalOverlay}>
          <View style={Styles.loadingCard}>
            <ActivityIndicator size="large" color={dash.BLUE} />
            <Text style={Styles.loadingText}>Verifying face…</Text>
          </View>
        </View>
      </Modal>

      {/* Attendance result popup */}
      <Modal
        visible={result !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setResult(null)}
      >
        <View style={Styles.modalOverlay}>
          <View style={Styles.resultCard}>
            {result?.type === 'success' ? (
              <>
                <View
                  style={[Styles.resultIcon, { backgroundColor: `${colors.ACCENT_GREEN}18` }]}
                >
                  <Icon name="user-check" size="xl" color={colors.ACCENT_GREEN} strokeWidth={2} />
                </View>
                <Text style={Styles.resultTitle}>{result.message}</Text>
                <Text style={Styles.resultName}>{result.name}</Text>
                <Text style={Styles.resultSub}>
                  Match: {(result.similarity * 100).toFixed(1)}%
                </Text>
              </>
            ) : (
              <>
                <View
                  style={[Styles.resultIcon, { backgroundColor: `${colors.RED}18` }]}
                >
                  <Icon name="close" size="xl" color={colors.RED} strokeWidth={2.5} />
                </View>
                <Text style={Styles.resultTitle}>Not Recorded</Text>
                <Text style={Styles.resultSub}>{result?.type === 'error' ? result.message : ''}</Text>
              </>
            )}

            <View style={Styles.resultActions}>
              <TouchableOpacity
                style={Styles.resultButtonOutline}
                activeOpacity={0.85}
                onPress={() => {
                  setResult(null);
                  handleMarkAttendance();
                }}
              >
                <Text style={Styles.resultButtonOutlineText}>Scan Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.resultButton}
                activeOpacity={0.85}
                onPress={() => setResult(null)}
              >
                <Text style={Styles.resultButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
