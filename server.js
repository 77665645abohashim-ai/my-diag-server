const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

const ORIGINAL_SERVER = "https://diagboss.ch";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Proxy Server is Running Successfully!");
});

// ==========================================
// مسار مخصص لاعتراض وتعديل رد diagsoftservice
// ==========================================
app.all('/api/v2/diagsoftservice', async (req, res) => {
    try {
        const targetUrl = `${ORIGINAL_SERVER}${req.originalUrl}`;
        console.log(`>>> Intercepting diagsoftservice request: ${targetUrl}`);

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

        let responseBody = response.data;

        try {
            const stringData = Buffer.from(responseBody).toString('utf8');
            console.log("Original diagsoftservice Response:", stringData); // طباعة الرد الأصلي في الـ Logs لنراه

            let jsonData = JSON.parse(stringData);

            // ==========================================
            // [منطقة التعديل]: عدل على jsonData هنا
            // ==========================================
            // مثال: تغيير حالات التراخيص أو القيم الراجعة
            // if (jsonData.status) { jsonData.status = 1; }

            responseBody = Buffer.from(JSON.stringify(jsonData), 'utf8');
            res.setHeader('Content-Length', responseBody.length);

        } catch (e) {
            console.log("diagsoftservice response is not JSON");
        }

        res.set(response.headers);
        return res.status(response.status).send(responseBody);

    } catch (error) {
        console.error("diagsoftservice proxy error:", error.message);
        return res.status(500).send("Proxy Server Error");
    }
});

// ==========================================
// السيرفر الوسيط العام لباقي المسارات
// ==========================================
app.all('/api/v2/*', async (req, res) => {
    try {
        const targetUrl = `${ORIGINAL_SERVER}${req.originalUrl}`;
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

app.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`);
});
