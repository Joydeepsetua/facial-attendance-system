import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Style from './Styles';
import { RootStackParamList } from '../../navigation/AppContainer';
import colors from '../../constants/colors';
import Icon from '../icons/Index';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  /** Optional header background colour. Falls back to the default light surface. */
  backgroundColor?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header: React.FC<HeaderProps> = ({ title, showBack = false, backgroundColor }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[Style.headerContainer, backgroundColor ? { backgroundColor } : null]}>
      {showBack && (
        <TouchableOpacity
          style={Style.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Icon name="back" size="md" color={colors.SURFACE_TEXT} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
      <Text
        style={[Style.title, !showBack && Style.titleNoBack]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
};

export default Header;
