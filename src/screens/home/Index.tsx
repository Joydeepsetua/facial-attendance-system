import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import { RootStackParamList } from '../../navigation/AppContainer';
import Styles from './Styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={Styles.container}>
      <Header title="Facial Attendance" />
      <View style={Styles.content}>
        <View style={Styles.buttonContainer}>
          <TouchableOpacity
            style={[Styles.button, Styles.buttonPrimary]}
            onPress={() => navigation.navigate('Users')}
          >
            <Text style={Styles.buttonIcon}>👤</Text>
            <Text style={Styles.buttonText}>Create User</Text>
            <Text style={Styles.buttonSubtext}>Register new employee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.button, Styles.buttonSuccess]}
            onPress={() => navigation.navigate('Attendance')}
          >
            <Text style={Styles.buttonIcon}>📸</Text>
            <Text style={Styles.buttonText}>Mark Attendance</Text>
            <Text style={Styles.buttonSubtext}>Take photo for attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.button, Styles.buttonInfo]}
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