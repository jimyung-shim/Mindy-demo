// components/ChatMessage.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ChatMessage({ sender, text, avatar }) {
  const isBot = sender === 'bot';
  return (
    <View
      style={[
        styles.container,
        isBot ? styles.botContainer : styles.userContainer,
      ]}
    >
      {isBot && <Image source={avatar} style={styles.avatar} />}
      <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
        <Text style={[styles.text, isBot ? styles.botText : styles.userText]}>
          {text}
        </Text>
      </View>
      {!isBot && <Image source={avatar} style={styles.avatar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  botContainer: { justifyContent: 'flex-start' },
  userContainer: { justifyContent: 'flex-end' },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: '#f3e9ff',
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: '#e6f0ff',
    borderTopRightRadius: 0,
  },
  text: { fontSize: 14, lineHeight: 20 },
  botText: { color: '#333' },
  userText: { color: '#222' },
});
