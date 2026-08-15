const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// إعدادات الـ Middleware لقراءة البيانات
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// السيرفر المستهدف الأصلي
const TARGET_SERVER = 'https://diagboss.ch';

// مسار الناقل (Proxy) لأي طلب يتم إرساله
app.all('/api/v2/*', async (req, res) => {
    try {
        const targetUrl = `${TARGET_SERVER}${req.originalUrl}`;
        
        console.log(`[Proxy Request] ${req.method} -> ${targetUrl}`);

        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                host: 'diagboss.ch'
            },
            data: req.body,
            validateStatus: () => true
        });

        res.status(response.status).send(response.data);

    } catch (error) {
        console.error('[Proxy Error]:', error.message);
        res.status(500).json({
            error: 'Proxy server failed to forward request',
            details: error.message
        });
    }
});

// مسار افتراضي للتأكد من أن السيرفر يعمل
app.get('/', (req, res) => {
    res.send('Proxy Server is running successfully!');
});

// تشغيل السيرفر على المنفذ المخصص أو 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
