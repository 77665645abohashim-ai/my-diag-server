const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// الرابط الأساسي للسيرفر الأصلي
const ORIGINAL_SERVER = "https://diagboss.ch";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسار افتتاحي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send("Proxy Server is Running Successfully!");
});

// ==========================================
// السيرفر الوسيط العام (Reverse Proxy) لأي طلب
// ==========================================
app.all('/api/v2/*', async (req, res) => {
    try {
        const targetUrl = `${ORIGINAL_SERVER}${req.originalUrl}`;
        console.log(`Proxying ${req.method} request to: ${targetUrl}`);

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: new URL(ORIGINAL_SERVER).host
            },
            responseType: 'arraybuffer',
            validateStatus: () => true
        });

        res.set(response.headers);
        return res.status(response.status).send(response.data);

    } catch (error) {
        console.error("Proxy error:", error.message);
        return res.status(500).send("Proxy Server Error");
    }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`);
});
