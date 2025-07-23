// proxy-server/routes/chat.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const anonymize = require('../middlewares/anonymize');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /chat
 * Body: { messages: [{ role: 'user'|'system'|'assistant', content: string }, ...] }
 */
router.post('/', anonymize, async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    // OpenAI 응답에서 첫 번째 메시지만 클라이언트에 전달
    const botMessage = completion.choices[0].message;
    res.json(botMessage);
  } catch (err) {
    console.error('❌ OpenAI API Error:', err);
    res.status(500).json({ error: 'Failed to fetch from OpenAI' });
  }
});

module.exports = router;
