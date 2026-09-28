const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// تسجيل الطلبات الواردة
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming ${req.method} request for: ${req.url}`);
    next();
});

// التعامل مع جميع الطلبات وتوجيهها إلى diagboss.ch عبر Axios
app.all('*', async (req, res) => {
    try {
        const targetUrl = `https://diagboss.ch${req.url}`;
        console.log(`Proxying ${req.method} request to: ${targetUrl}`);

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: 'diagboss.ch'
            },
            validateStatus: () => true // السماح باستقبال جميع الـ Status Codes حتى لو كانت خطأ
        });

        if (req.url.includes('diagsoftservice')) {
            console.log(`=== Diagsoftservice Response ===`, response.data);
        }

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`Proxy error occurred:`, error.message);
        res.status(500).json({ error: 'Proxying failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`);
});
