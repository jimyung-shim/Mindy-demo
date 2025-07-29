import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Alert, StyleSheet } from 'react-native';
import { PROXY_SERVER } from '@env';

export default function ChatLogAdminScreen() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${PROXY_SERVER}/logs`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('로그 불러오기 오류:', err);
    }
  };

  const deleteAllLogs = async () => {
    try {
      await fetch(`${PROXY_SERVER}/logs`, { method: 'DELETE' });
      Alert.alert('✅ 로그 삭제 완료');
      fetchLogs();
    } catch (err) {
      console.error('삭제 실패:', err);
      Alert.alert('❌ 삭제 실패');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>대화 로그 관리</Text>
      <Button title="🧹 모든 로그 삭제" onPress={deleteAllLogs} color="#cc4444" />
      {logs.map((log, i) => (
        <View key={i} style={styles.logBox}>
          <Text style={styles.id}>🆔 세션: {log.sessionId}</Text>
          {log.messages.map((m, j) => (
            <Text key={j} style={styles.msg}>
              [{m.role}] {m.content}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  logBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  id: { fontWeight: 'bold', marginBottom: 8 },
  msg: { fontSize: 13, marginBottom: 2 },
});
