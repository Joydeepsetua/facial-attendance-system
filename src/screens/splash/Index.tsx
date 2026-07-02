import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageBackground, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppContainer';
import { createTable } from '../../sqlite';
import Styles from './Styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // Animated values
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameTranslate = useRef(new Animated.Value(18)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize the database now, while the splash animation plays and the
    // JS thread is otherwise idle — so Home doesn't do it during the transition.
    createTable().catch((error) => {
      console.error('Error initializing database:', error);
    });

    // Intro -> short hold, then navigate. The exit itself is a single native
    // cross-fade (Home uses a 'fade' entry animation), so nothing competes
    // with it on the JS thread and there's no stall at the hand-off.
    Animated.sequence([
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslate, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // brief, intentional hold so the name is readable
      Animated.delay(700),
    ]).start(({ finished }) => {
      if (finished) {
        navigation.replace('Home');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[Styles.container, { opacity: bgOpacity }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/images/splash_bg.png')}
        style={Styles.background}
        resizeMode="cover"
      >
        <View style={Styles.center}>
          {/* Logo */}
          <Animated.View
            style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
          >
            <Image
              source={require('../../assets/images/logos/blue.png')}
              style={Styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* App name */}
          <Animated.Text
            style={[
              Styles.appName,
              { opacity: nameOpacity, transform: [{ translateY: nameTranslate }] },
            ]}
          >
            FaceTen
          </Animated.Text>

          <Animated.Text style={[Styles.tagline, { opacity: taglineOpacity }]}>
            Facial Attendance System
          </Animated.Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default SplashScreen;
