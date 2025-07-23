// components/InputBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function InputBar({ value, onChangeText, onSend }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="오늘 하루 어땠는지 얘기해볼까요?"
          value={value}
          onChangeText={onChangeText}
        />
        {/* 간단히 이모지 예시 😊😐😢😱😴 */}
        <Text style={styles.emoji}></Text>
      </View>
      <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
        <Text style={styles.sendText}>전송</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 80,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    marginRight: 8,
    height: 40,
  },
  input: { flex: 1, fontSize: 14 },
  emoji: { marginLeft: 8 },
  sendBtn: {
    backgroundColor: '#5c4ccf',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: { color: '#fff', fontWeight: '600' },
});
