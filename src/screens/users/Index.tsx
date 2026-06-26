import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Modal, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import { RootStackParamList } from '../../navigation/AppContainer';
import { getAllUsers, deleteUser, User } from '../../sqlite/service/user';
import Styles from './Styles';
import colors from '../../constants/colors';
import Icon from '../../components/icons/Index';
import { showToast } from '../../utils/toast';

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
      <Icon name="user" size="xl" color={colors.BRAND} strokeWidth={1.5}  />
      <Text style={Styles.emptyText}>No users found</Text>
      <Text style={Styles.emptySubtext}>Create your first user to get started</Text>
    </View>
  );
};

const keyExtractor = (item: User) => item.uuid;

interface UserItemProps {
  item: User;
  onMenuPress: (item: User, event: any) => void;
}

const UserItem = React.memo(({ item, onMenuPress }: UserItemProps) => (
  <View style={Styles.userCard}>
    <View style={Styles.userAvatar}>
      <Text style={Styles.userAvatarText}>
        {item.name.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={Styles.userInfo}>
      <Text style={Styles.userName}>{item.name}</Text>
      <Text style={Styles.userDate}>
        {[item.employee_id ? `ID ${item.employee_id}` : null, item.phone || null]
          .filter(Boolean)
          .join('  ·  ')}
      </Text>
    </View>
    <TouchableOpacity
      style={Styles.menuButton}
      onPress={(e) => onMenuPress(item, e)}
    >
      <Icon name="more-vertical" size="sm" color={colors.SURFACE_TEXT_MUTED} />
    </TouchableOpacity>
  </View>
));

const Users = () => {
  const navigation = useNavigation<NavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const menuUser = users.find(u => u.uuid === activeMenu);

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

  const handleDelete = useCallback((user: User) => {
    setActiveMenu(null);
    setDeleteTarget(user);
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteUser(deleteTarget.uuid);
    if (success) {
      showToast('User deleted successfully', 'success');
      fetchUsers();
    } else {
      showToast('Failed to delete user', 'error');
    }
    setDeleteTarget(null);
  };

  const handleEdit = useCallback((userUuid: string) => {
    setActiveMenu(null);
    navigation.navigate('EditUser', { userUuid });
  }, [navigation]);

  const handleMenuPress = useCallback((item: User, event: any) => {
    event.target.measure((_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
      setMenuPosition({ top: pageY + height, right: 20 });
      setActiveMenu(item.uuid);
    });
  }, []);

  const renderUserItem = useCallback(({ item }: { item: User }) => (
    <UserItem item={item} onMenuPress={handleMenuPress} />
  ), [handleMenuPress]);

  return (
    <SafeAreaView style={Styles.screen} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.SURFACE_BG} barStyle="dark-content" />
      <Header title="Users" showBack />
      <View style={Styles.content}>
        <TouchableOpacity
          style={Styles.createButton}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Icon name="user-plus" size="xl" color={colors.PRIMARY} strokeWidth={1.5} />
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

        <Modal
          visible={activeMenu !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveMenu(null)}
        >
          <Pressable style={Styles.overlay} onPress={() => setActiveMenu(null)}>
            <View style={[Styles.popupMenu, { top: menuPosition.top, right: menuPosition.right }]}>
              <TouchableOpacity style={Styles.popupMenuItem} onPress={() => menuUser && handleEdit(menuUser.uuid)}>
                <Icon name="edit" size="xs" color={colors.SURFACE_TEXT} />
                <Text style={Styles.popupMenuText}>Edit</Text>
              </TouchableOpacity>
              <View style={Styles.popupMenuDivider} />
              <TouchableOpacity style={Styles.popupMenuItem} onPress={() => menuUser && handleDelete(menuUser)}>
                <Icon name="trash" size="xs" color={colors.RED} />
                <Text style={[Styles.popupMenuText, Styles.popupMenuTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <Modal
          visible={deleteTarget !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setDeleteTarget(null)}
        >
          <Pressable style={Styles.deleteOverlay} onPress={() => setDeleteTarget(null)}>
            <Pressable style={Styles.deleteModal}>
              <View style={Styles.deleteIconContainer}>
                <Icon name="trash" size="lg" color={colors.RED} />
              </View>
              <Text style={Styles.deleteTitle}>Delete User</Text>
              <Text style={Styles.deleteMessage}>
                Are you sure you want to delete{' '}
                <Text style={Styles.deleteUserName}>{deleteTarget?.name}</Text>?
                All associated attendance records will also be removed.
              </Text>
              <View style={Styles.deleteActions}>
                <TouchableOpacity
                  style={Styles.deleteButton}
                  onPress={confirmDelete}
                >
                  <Text style={Styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.cancelButton}
                  onPress={() => setDeleteTarget(null)}
                >
                  <Text style={Styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Users;