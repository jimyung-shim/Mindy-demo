// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView,Platform, TouchableWithoutFeedback,Keyboard } from 'react-native';
import ChatMessage from '../components/ChatMessage';
import QuickReplyButton from '../components/QuickReplyButton';
import InputBar from '../components/InputBar';
import QuestionnaireConsentModal from '../components/QuestionnaireConsentModal';
import { PROXY_SERVER } from '@env';

const initialMessages = [
  { id: '1', sender: 'bot', text: `안녕하세요 저는 감정 케어 챗봇 Mindy에요. 힘든 일 있으면 얘기해 주시겠어요?` },
  //{ id: '2', sender: 'user', text: '기분은 괜찮았어요.' },
  //{ id: '3', sender: 'bot', text: '다행이에요! 혹시 식사는 챙기셨나요?' },
  //{ id: '4', sender: 'user', text: '하루 한 끼요...' },
  //{
    // id: '5',
    // sender: 'bot',
    // text: '그래도 뭐라도 드셨다니 다행이에요. 내일은 두 끼 도전 어때요?',
    //quickReplies: ['두 끼 도전하기'],
  //},
];

export default function ChatScreen({route, navigation}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [riskScores, setRiskScores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConsentPrompt, setShowConsentPrompt] = useState(false);
  const [awaitingConsentReply, setAwaitingConsentReply] = useState(false);

  // 빠른 응답 관련 state
  const [selectedQuick, setSelectedQuick] = useState(null);

  // 네비게이션 파라미터로 받은 이미지 (없으면 기본 아바타)
  const {personaImage, personaLabel}=route.params || {};

  const sessionId = useRef(Date.now().toString()).current;


  const onSend = async () => {
    console.log("💡 PROXY_SERVER:", PROXY_SERVER);
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    if (awaitingConsentReply) {
      const replyText = input.trim() || label;

      if (replyText === '예') {
        setModalVisible(true); // 문진표 다이얼로그 열기
      }

      // 상태 초기화
      setShowConsentPrompt(false);
      setAwaitingConsentReply(false);
      return; // 더 이상 GPT 호출 안 함
    }


    const newMessages = [...messages, userMessage];
    setMessages(newMessages); // 사용자 메시지 먼저 표시
    setInput('');

    console.log('✅ 서버 주소:', PROXY_SERVER);

    try {
      //proxy 서버에 보낼 때 role.content 형태
      const response = await fetch(`${PROXY_SERVER}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: newMessages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
        }),
      });

      const { content, riskScore } = await response.json();

      console.log('GPT 응답: ',content);

      // riskScores 상태에 추가
      setRiskScores((prev) => {
        const updated = [...prev, riskScore];

        // 즉시 트리거
        const avgRecent =
          updated.slice(-7).reduce((sum, s) => sum + s, 0) /
          Math.min(updated.length, 7);

        if (riskScore === 3 || avgRecent >= 2) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'bot',
              text: `지금 상태를 보니 문진표 작성을 권해드리고 싶어요. 괜찮으신가요?
            (수락: 예, 거절: 아니오)`,
              quickReplies: ['예', '아니오'],
            },
          ]);          
          setAwaitingConsentReply(true);   // 다음 응답은 yes/no로 받기  
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'bot',
              text: content,
            },
          ]);
        }

        return updated;
      });

    } catch (error) {
      console.error('프록시 서버 오류:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: '⚠️ 죄송합니다. 서버 오류로 응답을 받을 수 없어요.',
        },
      ]);
    }
  };

  // 모달 버튼 핸들러
  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('PHQ9',{
      personaImage,
      personaLabel,
      sessionId,
    });                 // ③
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 빠른 응답 관련 기능
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
          ? (personaImage || require('../assets/mindy-avatar.png'))
          : require('../assets/user_avatar.png')
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

      <QuestionnaireConsentModal
        visible={modalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* 빠른 응답 버튼 */}
      {/* {lastMsg.quickReplies && (
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
      )} */}

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
