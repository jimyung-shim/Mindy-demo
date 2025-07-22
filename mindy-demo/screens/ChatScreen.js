// screens/ChatScreen.js
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView,Platform, TouchableWithoutFeedback,Keyboard } from 'react-native';
import ChatMessage from '../components/ChatMessage';
import QuickReplyButton from '../components/QuickReplyButton';
import InputBar from '../components/InputBar';

const initialMessages = [
  { id: '1', sender: 'bot', text: '안녕하세요. 오늘 하루는 어땠나요?' },
  { id: '2', sender: 'user', text: '기분은 괜찮았어요.' },
  { id: '3', sender: 'bot', text: '다행이에요! 혹시 식사는 챙기셨나요?' },
  { id: '4', sender: 'user', text: '하루 한 끼요...' },
  {
    id: '5',
    sender: 'bot',
    text: '그래도 뭐라도 드셨다니 다행이에요. 내일은 두 끼 도전 어때요?',
    quickReplies: ['두 끼 도전하기'],
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [selectedQuick, setSelectedQuick] = useState(null);

  const onSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    // TODO: 프록시 서버에 요청 후 bot 응답 추가
  };

  const onQuickReply = (label) => {
    setSelectedQuick(label);
    const newMsg = { id: Date.now().toString(), sender: 'user', text: label };
    setMessages((prev) => [...prev, newMsg]);
    // TODO: 여기도 bot 응답 로직 추가
  };

  const renderItem = ({ item }) => (
    <ChatMessage
      sender={item.sender}
      text={item.text}
      avatar={
        item.sender === 'bot'
          ? require('../assets/mindy-avatar.png')
          : require('../assets/user-avatar.png')
      }
    />
  );

  const lastMsg = messages[messages.length - 1];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // iOS에서는 네비게이터 헤더 높이 정도만큼 오프셋을 줄 것
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />

      {/* 빠른 응답 버튼 */}
      {lastMsg.quickReplies && (
        <View style={styles.quickReplies}>
          {lastMsg.quickReplies.map((qr) => (
            <QuickReplyButton
              key={qr}
              label={qr}
              selected={selectedQuick === qr}
              onPress={() => onQuickReply(qr)}
            />
          ))}
        </View>
      )}

      <InputBar value={input} onChangeText={setInput} onSend={onSend} />
    </SafeAreaView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  list: { paddingVertical: 12 },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
});
