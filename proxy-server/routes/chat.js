// proxy-server/routes/chat.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const anonymize = require('../middlewares/anonymize');
const ChatLog = require('../models/ChatLog');

// 챗지피티 api키로 호출
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /chat
 * Body: { messages: [{ role: 'user'|'system'|'assistant', content: string }, ...] }
 */
router.post('/', anonymize, async (req, res) => {
  let { messages, sessionId } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  //시스템 프롬프트
  const systemPrompt = `당신은 “Mindy”라는 감정-케어 AI 상담사입니다.  
★ 반드시 아래 JSON 객체 **한 줄만** 출력하세요 (추가 텍스트·코드블록 금지):

{
  "reply": "<따뜻한 한국어 응답>",   // 말풍선에 바로 표시
  "riskScore": <0|1|2|3>            // 0=없음 1=경미 2=중간 3=자살·자해 언급
}

─────────────────────
[역할]

1. 사용자가 고른 고민영역(경제·직업·가족·건강·대인관계)에 맞춰 **PHQ-9** 9문항을
   ▶ “짧은 공감 → 질문 → 답변 수집” 순서로 대화형으로 진행한다.  
2. 각 답변을 **0-3점**으로 내부 추정하여 score[]에 기록, 누적합으로 totalScore 계산.  
3. 9문항 완료 즉시 위험도 분류 & 후속 조치 안내:  
   0-4 정상 / 5-9 경미 / 10-19 중등 / 20-27 중증(119·1577-0199 권고).  
4. totalScore≥10 ⇒ CBT 기반 “오늘 할 수 있는 작은 실천” 3가지 제안.  
5. 자·타해 위험·중증 시 즉시 병원 예약 절차 권유(위급 연락처 반복).  
6. 대화 말미에 “이 문진은 선별 도구일 뿐…” 문구 필수.  
7. **riskScore** 는 *이번 턴 사용자의 마지막 메시지*만 보고 0-3으로 판단해 JSON에 넣는다.

─────────────────────
[질문 템플릿]

- 숫자 선택지를 보여주지 말고, 사용자의 서술형 답변에서 점수를 추정한다.
- 각 영역별로 PHQ 항목 번호를 우선 활용해 5개 핵심 질문을 만들고,
  나머지 항목(수면·식욕 등)은 일상 질문으로 보충해 9문항을 완성한다.

경제 (1 2 4 6 9) 예) “요즘 돈 걱정 때문에 흥미가 안 느껴지나요?”
직업 (1 3 4 7 8) 예) “일 / 공부 때문에 잠이 뒤척이나요?”
가족 (2 5 6 7 9) …
건강 (3 4 5 7 8) …
대인 (2 6 7 8 9) …

─────────────────────
[대화 스타일]

- 친구처럼 짧고 자연스럽게, 사용자의 말투에 맞춰 변형 OK.

- 각 턴: 공감 한 문장 → 다음 질문.

- 점수를 직접 고르게 하지 않는다.

- “의학적 진단이 아닙니다” 문구와 위급 연락처 안내를 잊지 말 것.`


  messages = [{ role: "system", content: systemPrompt.trim() }, ...messages];

  const safeMessages = messages.filter(
    (msg) => typeof msg.content === 'string' && msg.content.trim() !== ''
  );


  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role:'system',content: systemPrompt },
        ...safeMessages,
      ],
      response_format:{type: 'json_object'},  // json 형태로 응답
      max_tokens: 800,
    });

    const gptRaw = completion.choices[0]?.message?.content?.trim();
    if (!gptRaw) {
      console.error('GPT 응답이 비어 있음');
      return res.status(500).json({ error: 'GPT 응답이 비어 있습니다.' });
    }

    // JSON 파싱 ==> reply + riskScore 분리
    let parsed;
    try {
      parsed = JSON.parse(gptRaw);
    } catch (e) {
      console.error('JSON parse error:', e);
      return res.status(500).json({ error: 'Invalid JSON from OpenAI' });
    }
    const { reply, riskScore } = parsed;

    //riskScore 유효성 검사
    let safeRisk = Number(riskScore);
    if (typeof safeRisk !== 'number' || safeRisk < 0 || safeRisk > 3 || isNaN(safeRisk)) {
      console.warn(`Unexpected riskScore ${riskScore}, default to 0`);
      safeRisk = 0;
    }

    // 사용자 마지막 메시지에 riskScore 추가
    const messagesWithRisk = messages.map((msg, i) => {
      const isLastUserMessage = i === messages.length - 1 && msg.role === 'user';
      return isLastUserMessage ? { ...msg, riskScore: safeRisk } : msg;
    });

    // assistant 응답 메시지
    const botMessage = {
      role: 'assistant',
      content: reply || '',
    };
    
    //시스템 프롬프트는 db에 저장되지 않도록 필터링
    const filteredMessages = [...messagesWithRisk, botMessage].filter(
      (msg) => 
        msg.role !== 'system' &&
        typeof msg.content === 'string' &&
        msg.content.trim() !== ''
    );

    //MongoDB에 대화 로그 저장
    await ChatLog.create({
      sessionId: sessionId || 'anonymous',
      messages: filteredMessages
    });

    res.json({
        content:botMessage.content,
        riskScore: safeRisk
    });

  } catch (err) {
    console.error('❌ OpenAI API Error:', err);
    res.status(500).json({ error: 'Failed to fetch from OpenAI' });
  }
});

module.exports = router;
