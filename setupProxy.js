const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    'http://192.168.0.46:4000/', // This is the API prefix that the proxy will look for to forward requests
    createProxyMiddleware({
      target: 'http://192.168.0.46:4000/', // The backend server you're making requests to
      changeOrigin: true,
    })
  );
};