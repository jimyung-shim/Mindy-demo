import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Header({ title, onBack, right }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backArrow}>{'‹'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {right ? <View style={styles.right}>{right}</View> : null}
      {/* 오른쪽 빈 공간 */}
      {/*<View style={styles.spacer} />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginTop:15,
  },
  backButton: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  spacer: {
    width: 32,
  },
});
