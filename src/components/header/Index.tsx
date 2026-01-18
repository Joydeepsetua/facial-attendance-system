import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Style from './Styles';
import { RootStackParamList } from '../../navigation/AppContainer';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={Style.headerContainer}>
      <View style={Style.headLeft}>
        {showBack && (
          <TouchableOpacity style={Style.iconButton} onPress={() => navigation.goBack()}>
            <Text style={Style.iconText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={Style.titleContainer}>
          <Text style={Style.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
