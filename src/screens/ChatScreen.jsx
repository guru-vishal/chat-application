import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../services/api';
import { socket } from '../utils/socket';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';

const ChatScreen = ({ route, navigation }) => {
  const { userId: recipientId, username, profilePic, isOnline } = route.params;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientOnline, setRecipientOnline] = useState(isOnline);

  const { user } = useContext(AuthContext);
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Image
            source={{ uri: profilePic || 'https://via.placeholder.com/150' }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerUsername}>{username}</Text>
            <Text style={styles.headerStatus}>
              {recipientOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      ),
    });
  }, [navigation, username, profilePic, recipientOnline]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${recipientId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recipientId]);

  useEffect(() => {
    socket.on('newMessage', (data) => {
      if (data.senderId === recipientId) {
        setMessages((prevMessages) => [...prevMessages, {
          sender: recipientId,
          recipient: user.id,
          content: data.content,
          createdAt: data.createdAt,
        }]);
      }
    });

    socket.on('userTyping', (data) => {
      if (data.senderId === recipientId) {
        setIsTyping(data.isTyping);
      }
    });

    socket.on('userStatus', (data) => {
      if (data.userId === recipientId) {
        setRecipientOnline(data.isOnline);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('userStatus');
    };
  }, [recipientId, user.id]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  const handleMessageSent = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isCurrentUser={item.sender === user.id || item.sender._id === user.id}
            />
          )}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>
                Send a message to start the conversation
              </Text>
            </View>
          }
        />

        {isTyping && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>{username} is typing...</Text>
          </View>
        )}

        <MessageInput
          currentUserId={user.id}
          recipientId={recipientId}
          onMessageSent={handleMessageSent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerUsername: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  headerStatus: {
    color: '#e0e7ff',
    fontSize: 12,
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
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
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  typingText: {
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 14,
  },
});

export default ChatScreen;
