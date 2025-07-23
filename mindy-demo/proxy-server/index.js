// proxy-server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB 연결
connectDB();

// 모든 /chat 요청은 routes/chat.js 로 위임
app.use('/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`🛡️  Proxy server listening on http://localhost:${PORT}`);
});
