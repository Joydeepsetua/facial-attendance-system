import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  InteractionManager,
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

  // Refresh stats whenever the dashboard regains focus.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const users = await getAllUsers();
          const today = todayString();
          const att = await getAllAttendance('', today, today, 1, 1);
          if (active) {
            setStats({ users: users.length, today: att.pagination.totalCount });
          }
        } catch (error) {
          console.error('Error loading dashboard stats:', error);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

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
      onPress: () => navigation.navigate('Attendance'),
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
    </SafeAreaView>
  );
};

export default Home;
