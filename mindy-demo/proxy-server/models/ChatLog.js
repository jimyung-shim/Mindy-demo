const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  sessionId: String,        // 사용자를 구분할 수 있는 임시 ID
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
