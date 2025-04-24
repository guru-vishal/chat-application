import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../services/api';
import { socket } from '../utils/socket';

const UserItem = ({ user, onPress, onlineUsers }) => {
  const isOnline = onlineUsers[user._id] || user.isOnline;

  return (
    <TouchableOpacity style={styles.userItem} onPress={() => onPress(user)}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.profilePic || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <View
          style={[
            styles.onlineIndicator,
            { backgroundColor: isOnline ? '#10b981' : '#9ca3af' },
          ]}
        />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.statusText}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const UsersListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
        navigation.replace('Login');
      } catch (error) {
        console.error('Logout error:', error);
        Alert.alert('Error', 'Failed to logout');
      }
    };

    fetchUsers();

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  useEffect(() => {
    socket.on('userStatus', ({ userId, isOnline }) => {
      setOnlineUsers(prev => ({
        ...prev,
        [userId]: isOnline,
      }));
    });

    return () => {
      socket.off('userStatus');
    };
  }, []);

  const handleUserPress = (selectedUser) => {
    navigation.navigate('Chat', {
      userId: selectedUser._id,
      username: selectedUser.username,
      profilePic: selectedUser.profilePic,
      isOnline: onlineUsers[selectedUser._id] || selectedUser.isOnline,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <Text style={styles.contactCount}>{users.length} contacts</Text>
      </View>

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
          <Text style={styles.emptySubtext}>
            You'll see other users here once they sign up
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onPress={handleUserPress}
              onlineUsers={onlineUsers}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  contactCount: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  listContainer: {
    paddingVertical: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  logoutButton: {
    marginRight: 16,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default UsersListScreen;
