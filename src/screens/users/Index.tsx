import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import { RootStackParamList } from '../../navigation/AppContainer';
import Styles from './Styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Users = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={Styles.container}>
      <Header title="Users" showBack />
      <View style={Styles.content}>
        <TouchableOpacity
          style={Styles.createButton}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Text style={Styles.createButtonIcon}>+</Text>
          <Text style={Styles.createButtonText}>Create New User</Text>
        </TouchableOpacity>
        <ScrollView style={Styles.listContainer}>
          {/* User list will be added here */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Users;