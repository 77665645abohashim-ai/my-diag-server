const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// السيرفر الأصلي المستهدف
const TARGET_SERVER = 'https://diagboss.ch';

// طباعة كل طلب يصل إلى Render لمعاينته في شاشة الـ Logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
    next();
});

// توجيه كافة الطلبات (بما فيها /api/v2/login)
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            // ضبط الهيدرات ليتعرف عليها السيرفر الأصلي
            proxyReq.setHeader('Host', 'diagboss.ch');
            proxyReq.setHeader('Origin', TARGET_SERVER);
            console.log(`[PROXY] Forwarding ${req.method} request to: ${TARGET_SERVER}${req.url}`);
        },
        proxyRes: (proxyRes, req, res) => {
            console.log(`[PROXY] Received response from ${TARGET_SERVER} with Status: ${proxyRes.statusCode}`);
        },
        error: (err, req, res) => {
            console.error('[PROXY ERROR]:', err.message);
            res.status(502).json({ error: "Bad Gateway - Proxy error connecting to target" });
        }
    }
}));

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
