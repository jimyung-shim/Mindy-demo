// components/QuickReplyButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function QuickReplyButton({ label, onPress, selected }) {
  return (
    <TouchableOpacity
      style={[styles.button, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#d0bfff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    marginVertical: 4,
  },
  selected: {
    backgroundColor: '#5c4ccf',
    borderColor: '#5c4ccf',
  },
  text: {
    fontSize: 14,
    color: '#5c4ccf',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
});
