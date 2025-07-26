import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QuestionItem({ number, text, score }) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{number}.</Text>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  number: {
    width: 24,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  score: {
    width: 32,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '600',
    color: '#556cd6',
  },
});
