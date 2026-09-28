const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

// طباعة تفاصيل أي طلب وارد مع تمييز مسار diagsoftservice
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Incoming ${req.method} request for: ${req.url}`);
    
    if (req.url.includes('/api/v2/diagsoftservice')) {
        console.log('>>> [DIAG SOFT SERVICE REQUEST DETECTED] <<<');
    }
    next();
});

// توجيه جميع الطلبات عبر الـ Proxy مع الحفاظ على البيانات الخام (Raw Body)
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: true,
    xfwd: true, // نقل معلومات الـ IP والـ Host الأصلية
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
