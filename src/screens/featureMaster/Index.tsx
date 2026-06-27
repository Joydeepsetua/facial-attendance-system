import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header/Index';
import Icon from '../../components/icons/Index';
import colors from '../../constants/colors';

const FeatureMaster = () => {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Feature Master" showBack />
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Icon name="sliders" size="xl" color={colors.BRAND} strokeWidth={1.8} />
        </View>
        <Text style={styles.title}>Feature Master</Text>
        <Text style={styles.subtitle}>
          Configure app features and modules here. Setup coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: `${colors.BRAND}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default FeatureMaster;
