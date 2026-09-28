const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app =express();
const PORT = process.env.PORT || 10000;

// تفعيل تسجيل الطلبات لمراقبة كل ما يرسله التطبيق
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming ${req.method} request for: ${req.url}`);
    next();
});

// إعداد البروكسي لتوجيه الطلبات إلى diagboss.ch مع تجاوز مشاكل الشهادات والاتصال
app.use('/', createProxyMiddleware({
    target: 'https://diagboss.ch',
    changeOrigin: true,
    secure: false, // تجاوز أخطاء شهادات SSL إذا وجدت
    xfwd: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying & Intercepting ${req.method} request to: https://diagboss.ch${req.url}`);
        
        // إذا كان الطلب يحتوي على الجسم (Body)، نقوم بإعادة كتابته لضمان وصوله سليماً
        if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        let originalResponseBody = '';
        
        proxyRes.on('data', (chunk) => {
            originalResponseBody += chunk;
        });
        
        proxyRes.on('end', () => {
            if (req.url.includes('diagsoftservice')) {
                console.log(`=== Diagsoftservice Response ===`);
                console.log(originalResponseBody);
            }
        });
    },
    onError: (err, req, res) => {
        console.error(`Proxy error occurred:`, err.message);
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });
        res.end('Proxying failed: ' + err.message);
    }
}));

app.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`);
});
