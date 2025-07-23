// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindyChatLogs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB 연결 성공');
  } catch (err) {
    console.error('❌ MongoDB 연결 실패:', err);
  }
};

module.exports = connectDB;
