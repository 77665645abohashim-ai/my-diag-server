const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// 1. مسار مخصص للرد المباشر على طلب الروابط (بدون الذهاب للسيرفر الأصلي)
app.get('/api/v2/urls', (req, res) => {
    console.log('[Custom Handler] Intercepted URL config request from app');
    
    // هنا ضع الرد الذي تريد أن يراه التطبيق لتوجيه المسارات أو الروابط بالشكل الذي يناسبك
    res.json({
        code: 0,
        msg: "success",
        data: {
            // ضع هنا الروابط أو الإعدادات الجديدة التي تريد ان يقرأها التطبيق
            url: "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1.0/DEMO.zip",
            urls: [
                { key: "base_url", value: "https://my-diag-server.onrender.com" }
            ]
        }
    });
});

// 2. الوسيط الشامل باقي المسارات (Catch-All Proxy)
app.all('*', async (req, res) => {
    try {
        const fullTargetUrl = `${TARGET_SERVER}${req.originalUrl}`;
        console.log(`[Proxy] Forwarding ${req.method} request to: ${fullTargetUrl}`);

        const response = await axios({
            method: req.method,
            url: fullTargetUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: 'diagboss.ch'
            },
            validateStatus: () => true
        });

        let responseData = response.data;

        if (responseData && typeof responseData === 'object') {
            if (responseData.data) {
                if (typeof responseData.data.url === 'string') {
                    responseData.data.url = 'https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1.0/DEMO.zip';
                }
            }
        }

        res.status(response.status).json(responseData);

    } catch (error) {
        console.error('[Proxy Error]:', error.message);
        res.status(500).json({
            code: -1,
            msg: "Global proxy connection failed",
            data: {}
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
