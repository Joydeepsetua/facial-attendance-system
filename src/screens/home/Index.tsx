import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import { RootStackParamList } from '../../navigation/AppContainer';
import Styles from './Styles';
import { createTable } from '../../sqlite';
import colors from '../../constants/colors';
import Icon from '../../components/icons/Index';
import { ICON_MAP } from '../../components/icons/icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  useEffect(() => {
    // Initialize database tables
    createTable().catch((error) => {
      console.error('Error initializing database:', error);
    });
  }, []);

  return (
    <SafeAreaView style={Styles.container}>
      <Header title="Facial Attendance" />
      <View style={Styles.content}>
        <View style={Styles.buttonContainer}>
          <TouchableOpacity
            style={[Styles.button]}
            onPress={() => navigation.navigate('Users')}
          >
            <Icon name="users" size="xxl" color={colors.PRIMARY} strokeWidth={2}  />
            <Text style={Styles.buttonText}>Users</Text>
            <Text style={Styles.buttonSubtext}>Register new employee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.button]}
            onPress={() => navigation.navigate('Attendance')}
          >
            <Text style={Styles.buttonIcon}>📸</Text>
            <Text style={Styles.buttonText}>Mark Attendance</Text>
            <Text style={Styles.buttonSubtext}>Take photo for attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.button]}
            onPress={() => navigation.navigate('Report')}
          >
            <Text style={Styles.buttonIcon}>📊</Text>
            <Text style={Styles.buttonText}>View Report</Text>
            <Text style={Styles.buttonSubtext}>Check attendance records</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;