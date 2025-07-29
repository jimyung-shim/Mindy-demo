// screens/PersonaSelectScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,ScrollView } from 'react-native';
import PersonaCard from '../components/PersonaCard';

const personaList = [
  { id: 'economy', label: '경제', image: require('../assets/personas/economy.png') },
  { id: 'job', label: '직업', image: require('../assets/personas/job.png') },
  { id: 'family', label: '가족 문제', image: require('../assets/personas/family.png') },
  { id: 'relationship', label: '대인 관계', image: require('../assets/personas/relationship.png') },
  { id: 'health', label: '신체 문제', image: require('../assets/personas/health.png') },
];

export default function PersonaSelectScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleStart = () => {
    if (selectedId) {
      const selectedPersona = personaList.find((p) => p.id === selectedId);
      navigation.navigate('Chat', { 
        personaId: selectedPersona.id,
        personaLabel: selectedPersona.label,
        personaImage: selectedPersona.image,
      });

    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>나에게 가장 큰 스트레스를 주는 분야를 선택하세요.</Text>

      <View style={styles.grid}>
        {personaList.map((item) => (
          <PersonaCard
            key={item.id}
            label={item.label}
            imageSource={item.image}
            selected={item.id === selectedId}
            onPress={() => handleSelect(item.id)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, !selectedId && styles.buttonDisabled]}
        onPress={handleStart}
        disabled={!selectedId}
      >
        <Text style={styles.buttonText}>상담 시작하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#5c4ccf',
    paddingVertical: 12,
    paddingHorizontal: 40,
    width:'80%',
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize:17,
    color: 'white',
    fontWeight: 'bold',
  },
});