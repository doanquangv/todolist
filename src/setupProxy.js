// src/setupProxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Nếu yêu cầu có đường dẫn bắt đầu bằng '/api', nó sẽ được chuyển tiếp
    createProxyMiddleware({
      target: 'http://localhost:1337', // URL của máy chủ Sails
      changeOrigin: true,
    })
  );
};
