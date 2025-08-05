const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog'); // 이미 있는 모델

// GET /logs: 모든 대화 로그 조회
router.get('/', async (req, res) => {
  const logs = await ChatLog.find().sort({ createdAt: -1 });
  res.json(logs);
});

// DELETE /logs: 전체 삭제
router.delete('/', async (req, res) => {
  await ChatLog.deleteMany({});
  res.json({ success: true });
});

module.exports = router;
