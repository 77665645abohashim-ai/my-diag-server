const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

app.use(express.text({ type: '*/*' }));

// إذا أرسل التطبيق الطلب إلى المسار الرئيسي / مباشرة، تحويله أوتوماتيكياً إلى /api/v2/login
app.use((req, res, next) => {
    if (req.url === '/' && req.method === 'POST') {
        req.url = '/api/v2/login';
    }
    next();
});

app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('Host', 'diagboss.ch');
            proxyReq.setHeader('Origin', TARGET_SERVER);

            if (req.body) {
                const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', req.headers['content-type'] || 'application/x-www-form-urlencoded');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        proxyRes: (proxyRes, req, res) => {
            console.log(`[PROXY] ${req.method} ${req.url} -> Status: ${proxyRes.statusCode}`);
        }
    }
}));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
