const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

// طباعة تفاصيل أي طلب وارد
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming ${req.method} request for: ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// توجيه جميع الطلبات إلى السيرفر الأصلي مع الحفاظ على البيانات
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} request to: ${TARGET_SERVER}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`=== Response for ${req.url} [Status: ${proxyRes.statusCode}] ===`);
    }
}));

app.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`);
});
