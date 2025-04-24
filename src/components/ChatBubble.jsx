import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatBubble = ({ message, isCurrentUser }) => {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.content}
        </Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp,
        ]}
      >
        {formatTime(message.createdAt)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    backgroundColor: '#6366f1',
  },
  otherUserBubble: {
    backgroundColor: '#f3f4f6',
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#ffffff',
  },
  otherUserText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  currentUserTimestamp: {
    alignSelf: 'flex-end',
    color: '#6b7280',
  },
  otherUserTimestamp: {
    alignSelf: 'flex-start',
    color: '#6b7280',
  },
});

export default ChatBubble;
