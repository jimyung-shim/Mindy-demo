import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import QuestionItem from '../components/QuestionItem';
import ExpertReservationDialog from '../components/ExpertReservationDialog';
import { PROXY_SERVER} from '@env';

// 고정 질문 리스트
const QUESTIONS = [
  '일을 하는 것에 대한 흥미나 재미가 거의 없음',
  '가라앉은 느낌, 우울감 혹은 절망감',
  '잠들기 어렵거나 자꾸 깨어남, 혹은 너무 많이 잠',
  '피곤함, 기억력 저하됨',
  '식욕 저하 혹은 과식',
  '내 자신이 나쁜 사람이라는 느낌 혹은 실패자라고 느낌',
  '신문을 읽거나 TV를 볼 때 집중하기 어려움',
  '말이 느리거나 반대로 초조하고 안절부절 못함',
  '차라리 죽는 것이 낫겠다는 생각 혹은 자해 충동'
];

const BASE_RESERVATION = {
  hospital: '00병원',
  doctor: '김OO 의사',
  date: '08/13',
  time: '14:00',
  //personaName: 'Mindy',
  //personaImage: require('../assets/mindy-avatar.png'),
};


export default function QuestionnaireScreen({ navigation, route }) {
  // sessionId를 전달받거나 anonymous로 기본 설정
  const sessionId = route.params?.sessionId || 'anonymous';

  // scores: PHQ-9 점수 배열
  const [scores, setScores] = useState(
    route.params?.scores || QUESTIONS.map(() => 0)
  );

  // summary: GPT 요약 텍스트
  const [summary, setSummary] = useState('');

  // 전문가 예약 다이얼로그
  const [showReservationDialog, setShowReservationDialog] = useState(false);

  const {personaImage,personaLabel}=route.params || {};


  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch(`${PROXY_SERVER}/phq/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const text =await res.text();
        console.log('서버 응답:',text);

        const data = JSON.parse(text);

        if (data.answers && Array.isArray(data.answers)) {
          setScores(data.answers);
        }
        if (data.summary) {
          setSummary(data.summary);
        }
      } catch (err) {
        console.error('문진표 자동 로드 오류:', err);
      }
    }
    fetchScores();
  }, [sessionId]);

  // 문진표 결과 확인 이후 3초 뒤 다이얼로그 띄우기
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowReservationDialog(true);
    }, 6000);

    return () => clearTimeout(timeout); // 컴포넌트 언마운트 시 타이머 정리
  }, []);


  return (
    <View style={styles.container}>
      <Header 
      title="문진표" 
      onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => navigation.navigate('ChatLogAdmin')}>
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color="white" 
              style={{ marginRight: 12 }} 
              />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.topTitle}>
          AI가 사용자와의 대화를 바탕으로 작성한 문진표예요!
        </Text>
        {summary ? <Text style={styles.summary}>{summary}</Text> : null}
        <Text style={styles.subTitle}>
          일정 기준 이상이면 병원 또는 상담 예약을 추천할 수도 있어요!
        </Text>

        <View style={styles.divider} />

        <Text style={styles.questionHeader}>
          다음 증상들이 얼마나 자주 나타났는가? (0~3점)
        </Text>
        <Text style={styles.hint}>
          0 = 전혀 알 수 없거나 전혀 그렇게 느껴지지 않은 상황입니다.
        </Text>

        {QUESTIONS.map((q, idx) => (
          <QuestionItem
            key={idx}
            number={idx + 1}
            text={q}
            score={scores[idx]}
          />
        ))}
        
      </ScrollView>
      <ExpertReservationDialog
        visible={showReservationDialog}
        reservation={{
          ...BASE_RESERVATION,
          personaName: 'Mindy',
          personaImage: personaImage || require('../assets/mindy-avatar.png'),
        }}
        onAccept={() => {
          setShowReservationDialog(false);
          // 수락 후 처리 (예: 예약화면 이동 or 토스트 메시지)
        }}
        onDecline={() => {
          setShowReservationDialog(false);
          // 거절 후 처리
        }}
      />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  content: { paddingVertical: 16 },
  topTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#556cd6',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  summary: {
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  questionHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
