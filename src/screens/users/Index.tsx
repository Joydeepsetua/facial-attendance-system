import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import { RootStackParamList } from '../../navigation/AppContainer';
import { getAllUsers, User } from '../../sqlite/service/user';
import Styles from './Styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const renderUserItem = ({ item }: { item: User }) => {
  return (
    <View style={Styles.userCard}>
      <View style={Styles.userAvatar}>
        <Text style={Styles.userAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={Styles.userInfo}>
        <Text style={Styles.userName}>{item.name}</Text>
        <Text style={Styles.userDate}>
          Created: {formatDate(item.created_at)}
        </Text>
      </View>
    </View>
  );
};

const renderEmptyComponent = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <View style={Styles.emptyContainer}>
        <Text style={Styles.emptyText}>Loading users...</Text>
      </View>
    );
  }
  return (
    <View style={Styles.emptyContainer}>
      <Text style={Styles.emptyIcon}>👤</Text>
      <Text style={Styles.emptyText}>No users found</Text>
      <Text style={Styles.emptySubtext}>Create your first user to get started</Text>
    </View>
  );
};

const keyExtractor = (item: User) => item.uuid;

const Users = () => {
  const navigation = useNavigation<NavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

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
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={users.length === 0 ? Styles.listContainer : Styles.listContent}
          ListEmptyComponent={() => renderEmptyComponent({ loading })}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Users;