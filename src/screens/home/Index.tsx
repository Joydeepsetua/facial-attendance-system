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
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
} from 'react-native-svg';
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

// Scan-ring cluster (rings + icon share one box so they always stay centered).
const CLUSTER = 160;
const CC = CLUSTER / 2;

// Decorative particle dots scattered across the header (x/y in %, r in px).
const PARTICLES = [
  { x: '8%', y: '30%', r: 2, o: 0.5 },
  { x: '16%', y: '62%', r: 1.5, o: 0.35 },
  { x: '30%', y: '22%', r: 1.5, o: 0.4 },
  { x: '40%', y: '70%', r: 2, o: 0.3 },
  { x: '52%', y: '34%', r: 1.5, o: 0.45 },
  { x: '60%', y: '74%', r: 2.5, o: 0.5 },
  { x: '70%', y: '20%', r: 1.5, o: 0.4 },
  { x: '88%', y: '64%', r: 2, o: 0.45 },
  { x: '94%', y: '30%', r: 1.5, o: 0.35 },
  { x: '78%', y: '78%', r: 1.5, o: 0.3 },
  { x: '24%', y: '44%', r: 1, o: 0.3 },
  { x: '46%', y: '54%', r: 1, o: 0.3 },
];

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
  const [bannerSize, setBannerSize] = useState({ width: 0, height: 0 });
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
    { key: 'present', value: stats.today, label: 'Present', icon: 'check-circle', accent: colors.ACCENT_GREEN },
    { key: 'absent', value: absent, label: 'Absent', icon: 'x-circle', accent: colors.RED },
  ];

  const actions: Action[] = [
    {
      key: 'attendance',
      title: 'Mark Attendance',
      subtitle: 'Check-in & check-out',
      icon: 'scan-face',
      accent: colors.ACCENT_BLUE,
      onPress: handleMarkAttendance,
    },
    {
      key: 'addUser',
      title: 'Add User',
      subtitle: 'Register employee',
      icon: 'user-plus',
      accent: colors.ACCENT_BLUE,
      onPress: () => navigation.navigate('CreateUser'),
    },
    {
      key: 'users',
      title: 'Manage Users',
      subtitle: 'View & edit users',
      icon: 'users',
      accent: colors.ACCENT_GREEN,
      onPress: () => navigation.navigate('Users'),
    },
    {
      key: 'reports',
      title: 'Attendance',
      subtitle: 'View records',
      icon: 'chart-no-axes-combined',
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
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView
        contentContainerStyle={Styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header banner — gradient extends behind the status bar */}
        <View
          style={[Styles.banner, { paddingTop: insets.top + 16 }]}
          onLayout={(e) => setBannerSize(e.nativeEvent.layout)}
        >
          <Svg style={Styles.bannerGradient} pointerEvents="none">
            <Defs>
              <SvgLinearGradient id="hdrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0" stopColor="#2E7BF0" />
                <Stop offset="0.55" stopColor="#1E66E0" />
                <Stop offset="1" stopColor="#1450B5" />
              </SvgLinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#hdrGrad)" />

            {/* Particle dots */}
            {PARTICLES.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#FFFFFF" fillOpacity={p.o} />
            ))}
          </Svg>
          <View style={Styles.bannerTopRow}>
            <View>
              <Text style={Styles.greeting}>Welcome to</Text>
              <Text style={Styles.appName}>FaceTen</Text>
              <View style={Styles.dateRow}>
                <Icon name="calendar" size="xs" color="rgba(255,255,255,0.6)" strokeWidth={2} />
                <Text style={Styles.dateText}>{longDate()}</Text>
              </View>
            </View>
          </View>

          {/* Scan cluster: rings + icon in one box so they're always aligned */}
          <View
            style={[Styles.scanCluster, { top: bannerSize.height * 0.42 - CC }]}
            pointerEvents="box-none"
          >
            <Svg width={CLUSTER} height={CLUSTER} style={Styles.scanClusterSvg} pointerEvents="none">
              <Defs>
                <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor="#BFE0FF" stopOpacity="0.45" />
                  <Stop offset="1" stopColor="#BFE0FF" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx={CC} cy={CC} r={CC} fill="url(#glow)" />
              <Circle cx={CC} cy={CC} r="30" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
              <Circle cx={CC} cy={CC} r="50" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
              <Circle cx={CC} cy={CC} r="70" stroke="#FFFFFF" strokeOpacity="0.10" strokeWidth="1.5" fill="none" />
            </Svg>
            <TouchableOpacity
              style={Styles.scanBadge}
              activeOpacity={0.85}
              onPress={handleMarkAttendance}
            >
              <Icon name="scan-face" size="xxl" color={dash.ON_BLUE} strokeWidth={1.6} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's overview — floating card */}
        <View style={Styles.overviewCard}>
          <Text style={Styles.overviewTitle}>Today's Overview</Text>
          <View style={Styles.statsRow}>
            {overview.map((stat) => (
              <View key={stat.key} style={Styles.statCol}>
                <View
                  style={[Styles.statIconCircle, { backgroundColor: `${stat.accent}18` }]}
                >
                  <Icon name={stat.icon} size="md" color={stat.accent} strokeWidth={2.5} />
                </View>
                <Text style={Styles.statValue}>{stat.value}</Text>
                <Text style={Styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick actions */}
        <View style={Styles.sectionRow}>
          <Text style={Styles.sectionTitle}>Quick Actions</Text>
          <View style={Styles.viewAll}>
            <Text style={Styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size="xs" color={dash.BLUE} strokeWidth={2.5} />
          </View>
        </View>
        <View style={Styles.grid}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={Styles.actionCard}
              activeOpacity={0.85}
              onPress={action.onPress}
            >
              <View style={Styles.actionMain}>
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
              </View>
              <Icon name="chevron-right" size="sm" color={dash.TEXT_MUTED} strokeWidth={2} />
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
