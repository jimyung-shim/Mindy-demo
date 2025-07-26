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
    "answers": [2,1,1,0,3,2,1,0,2],
    "summary": "사용자는 전반적으로 무기력함과 수면 문제를 겪고 있으며, 특정 시기에 자살에 대한 언급도 있었습니다. 총점 12점은 중간 수준의 우울 증상을 시사합니다."
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
