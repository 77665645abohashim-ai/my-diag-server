const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

// تفعيل قراءة بيانات الـ JSON والـ URL-encoded من الطلبات
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// طباعة تفاصيل أي طلب وارد وبياناته بالكامل، مع تمييز خاص لمسار diagsoftservice
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Incoming ${req.method} request for: ${req.url}`);
    
    if (req.url.includes('/api/v2/diagsoftservice')) {
        console.log('>>> [DIAG SOFT SERVICE REQUEST DETECTED] <<<');
    }

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
