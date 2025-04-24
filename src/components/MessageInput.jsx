import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from '../services/api';
import { socket } from '../utils/socket';

const MessageInput = ({ currentUserId, recipientId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);


  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        senderId: currentUserId,
        recipientId,
        isTyping: true,
      });
    } else if (!message && isTyping) {
      setIsTyping(false);
      socket.emit('typing', {
        senderId: currentUserId,
        recipientId,
        isTyping: false,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (message) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', {
          senderId: currentUserId,
          recipientId,
          isTyping: false,
        });
      }, 1000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, currentUserId, recipientId]);

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post('/api/messages', {
        recipientId,
        content: message.trim(),
      });

      socket.emit('sendMessage', {
        senderId: currentUserId,
        recipientId,
        content: message.trim(),
      });

      setMessage('');

      if (isTyping) {
        setIsTyping(false);
        socket.emit('typing', {
          senderId: currentUserId,
          recipientId,
          isTyping: false,
        });
      }

      if (onMessageSent) {
        onMessageSent(response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };


  const handleEmojiSend = async (emoji) => {
    setIsSending(true);

    try {
      const response = await axios.post('/api/messages', {
        recipientId,
        content: emoji,
      });

      socket.emit('sendMessage', {
        senderId: currentUserId,
        recipientId,
        content: emoji,
      });

      if (isTyping) {
        setIsTyping(false);
        socket.emit('typing', {
          senderId: currentUserId,
          recipientId,
          isTyping: false,
        });
      }

      if (onMessageSent) {
        onMessageSent(response.data);
      }
    } catch (error) {
      console.error('Error sending emoji:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={'#9ca3af'}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.emojiContainer}>
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => handleEmojiSend('😊')}
          disabled={isSending}
        >
          <Text style={styles.emojiText}>😊</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => handleEmojiSend('👍')}
          disabled={isSending}
        >
          <Text style={styles.emojiText}>👍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => handleEmojiSend('❤️')}
          disabled={isSending}
        >
          <Text style={styles.emojiText}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => handleEmojiSend('😂')}
          disabled={isSending}
        >
          <Text style={styles.emojiText}>😂</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => handleEmojiSend('😭')}
          disabled={isSending}
        >
          <Text style={styles.emojiText}>😭</Text>
        </TouchableOpacity><TouchableOpacity
          style={styles.emojiButton}
          onPress={() => handleEmojiSend('😡')}
          disabled={isSending}
        >
          <Text style={styles.emojiText}>😡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    height: 50,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#a5b4fc',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  emojiButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    padding: 8,
    marginLeft: 12,
    marginRight: 10,
    marginBottom: 30,
  },
  emojiText: {
    fontSize: 20,
  },
});

export default MessageInput;