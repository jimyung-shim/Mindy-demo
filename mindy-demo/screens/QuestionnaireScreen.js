import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import QuestionItem from '../components/QuestionItem';

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

export default function QuestionnaireScreen({ navigation, route }) {
  // route.params.scores 형태로 서버에서 받은 점수를 전달한다고 가정
  // 없으면 0으로 초기화
  const [scores, setScores] = useState(
    route.params?.scores || QUESTIONS.map(() => 0)
  );

  // 예시: 마운트 시에 서버에서 점수 로드하기
  useEffect(() => {
    async function fetchScores() {
      // 예: 필요하다면 API 호출해서 setScores([...])
      // const res = await fetch(...);
      // const data = await res.json();
      // setScores(data);
    }
    fetchScores();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="문진표" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.topTitle}>
          AI가 사용자와의 대화를 바탕으로 작성한 문진표예요!
        </Text>
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
