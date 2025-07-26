// components/PersonaCard.js
import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';

export default function PersonaCard({ label, imageSource, selected, onPress }) {
return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    margin: 10,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#5c4ccf',
    borderRadius: 50,
    padding: 5,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});
