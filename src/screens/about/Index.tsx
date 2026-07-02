import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import { AppIconName } from '../../components/icons/icons';
import colors from '../../constants/colors';
import { RootStackParamList } from '../../navigation/AppContainer';
import { APP_VERSION } from '../../utils/faceCapture';
import Styles from './Styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const APP_NAME = 'FaceTen';
const VERSION = APP_VERSION;
const YEAR = '2026';

// Scattered decorative bubbles for the hero (size + position + tint).
const W = 'rgba(255,255,255,0.55)';
const B = 'rgba(160,196,255,0.45)';
const BUBBLES: { s: number; top?: number; bottom?: number; left?: number; right?: number; c: string }[] = [
  { s: 54, top: 18, left: 22, c: W },
  { s: 22, top: 40, left: 70, c: B },
  { s: 14, top: 96, left: 30, c: W },
  { s: 34, top: 150, left: 16, c: B },
  { s: 18, bottom: 30, left: 48, c: W },
  { s: 28, bottom: 20, left: 70, c: B },
  { s: 12, bottom: 96, left: 24, c: W },
  { s: 60, top: 30, right: 26, c: W },
  { s: 20, top: 92, right: 70, c: B },
  { s: 16, top: 64, right: 120, c: W },
  { s: 38, bottom: 26, right: 30, c: B },
  { s: 14, bottom: 70, right: 96, c: W },
  { s: 24, bottom: 110, right: 40, c: W },
];
const DEVELOPER = 'Joydeep Setua';

const FEATURES: { icon: AppIconName; text: string }[] = [
  { icon: 'scan', text: 'On-device facial recognition attendance' },
  { icon: 'camera', text: 'Live camera capture with blink liveness' },
  { icon: 'clock', text: 'Punch in / out with confirmation' },
  { icon: 'report', text: 'Attendance reports & employee management' },
];

const About = () => {
  const navigation = useNavigation<NavigationProp>();
  const [heroSize, setHeroSize] = useState({ width: 0, height: 0 });

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="About" showBack />
      <ScrollView contentContainerStyle={Styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View
          style={Styles.hero}
          onLayout={(e) =>
            setHeroSize({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
        >
          {/* Soft white → blue gradient base (explicit px size so it fills cleanly) */}
          {heroSize.width > 0 && (
            <Svg
              style={StyleSheet.absoluteFill}
              width={heroSize.width}
              height={heroSize.height}
            >
              <Defs>
                <SvgLinearGradient
                  id="heroGrad"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={heroSize.height}
                >
                  <Stop offset="0" stopColor="#CFE0FF" />
                  <Stop offset="1" stopColor="#FFFFFF" />
                </SvgLinearGradient>
              </Defs>
              <Rect x="0" y="0" width={heroSize.width} height={heroSize.height} fill="url(#heroGrad)" />
            </Svg>
          )}

          {/* Scattered decorative bubbles */}
          {BUBBLES.map((b, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: b.s,
                height: b.s,
                borderRadius: b.s / 2,
                backgroundColor: b.c,
                top: b.top,
                bottom: b.bottom,
                left: b.left,
                right: b.right,
              }}
            />
          ))}

          <View style={Styles.logoBadge}>
            <Image
              source={require('../../assets/images/logos/blue.png')}
              style={Styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={Styles.appName}>{APP_NAME}</Text>
          <View style={Styles.versionPill}>
            <Text style={Styles.versionText}>Version {VERSION}</Text>
          </View>
        </View>

        {/* About */}
        <View style={Styles.card}>
          <Text style={Styles.cardTitle}>About the app</Text>
          <Text style={Styles.body}>
            {APP_NAME} is a facial attendance system that lets organizations record employee
            attendance using on-device face recognition — no manual punching, and face data
            never leaves the device.
          </Text>
        </View>

        {/* Features */}
        <View style={Styles.card}>
          <Text style={Styles.cardTitle}>Key features</Text>
          {FEATURES.map((f, i) => (
            <View key={f.text} style={[Styles.featureRow, i > 0 && Styles.featureDivider]}>
              <View style={Styles.featureIcon}>
                <Icon name={f.icon} size="sm" color={colors.BRAND} strokeWidth={2.2} />
              </View>
              <Text style={Styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Legal quick links */}
        <View style={Styles.card}>
          <TouchableOpacity
            style={Styles.linkRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Legal', { type: 'privacy' })}
          >
            <View style={Styles.featureIcon}>
              <Icon name="lock" size="sm" color={colors.BRAND} strokeWidth={2.2} />
            </View>
            <Text style={Styles.linkText}>Privacy Policy</Text>
            <Icon name="chevron-right" size="sm" color={colors.SURFACE_TEXT_MUTED} strokeWidth={2.2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[Styles.linkRow, Styles.featureDivider]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Legal', { type: 'terms' })}
          >
            <View style={Styles.featureIcon}>
              <Icon name="report" size="sm" color={colors.BRAND} strokeWidth={2.2} />
            </View>
            <Text style={Styles.linkText}>Terms & Conditions</Text>
            <Icon name="chevron-right" size="sm" color={colors.SURFACE_TEXT_MUTED} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Developer credit */}
        <View style={Styles.card}>
          <View style={Styles.devRow}>
            <View style={Styles.devAvatar}>
              <Text style={Styles.devAvatarText}>{DEVELOPER.charAt(0)}</Text>
            </View>
            <View style={Styles.devInfo}>
              <Text style={Styles.devLabel}>Developed by</Text>
              <Text style={Styles.devName}>{DEVELOPER}</Text>
            </View>
          </View>
        </View>

        <Text style={Styles.copyright}>
          Made with ♥ by {DEVELOPER}{'\n'}© {YEAR} {APP_NAME}. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
