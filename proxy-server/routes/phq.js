const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const ChatLog = require('../models/ChatLog');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/analyze', async (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const log = await ChatLog.findOne({ sessionId }).sort({ createdAt: -1 });
    if (!log) return res.status(404).json({ error: 'No log found' });

    const userTexts = log.messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n');

    const systemPrompt = `
당신은 감정 케어 AI 챗봇입니다. 아래는 사용자의 대화 내역입니다.
해당 대화 내용을 바탕으로 PHQ-9 항목 각각에 대해 점수(0~3)를 추정하세요.

아래 JSON 형식으로만 응답하세요. (json 문자열 외에는 어떤 텍스트도 출력하지 마세요)

출력 형식:
{
    "answers": [<1번 항목 점수>,<2번 항목 점수>,<3번 항목 점수>,<4번 항목 점수>,<5번 항목 점수>,<6번 항목 점수>,<7번 항목 점수>,<8번 항목 점수>,<9번 항목 점수>],
    "summary": "<분석한 대화 내용을 바탕으로 사용자의 상태를 총점(1번~9번 까지의 항목별 점수 합)과 함께 한줄 요약>"
}
`;

    try {
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userTexts },
        ],
        response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content.trim());
    const { answers, summary } = parsed;
    res.json({ answers, summary });
    } catch (err) {
        console.error('PHQ 분석 실패:', err);
        res.status(500).json({ error: 'GPT 분석 실패' });
    }
});

module.exports = router;
