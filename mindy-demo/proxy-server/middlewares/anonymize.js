// proxy-server/middlewares/anonymize.js
module.exports = function anonymize(req, res, next) {
  // 클라이언트 IP나 User-Agent, X-Forwarded-For 헤더 제거
  delete req.headers['x-forwarded-for'];
  delete req.headers['x-real-ip'];
  delete req.headers['user-agent'];

  // req.clientIp를 기록하거나 완전 익명 표시
  req.clientIp = 'anonymous';

  next();
};
