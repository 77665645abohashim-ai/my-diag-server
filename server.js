const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/xml', 'application/xml', '*/*'] }));

// المسار الرئيسي
app.get('/', (req, res) => {
    res.json({ status: 'Server is running successfully', time: new Date() });
});

// 1. مسار الروابط (يحتوي على معاملات بحث query params)
app.get('/api/v2/urls', (req, res) => {
    const configNo = req.query.config_no || '0';
    const appId = req.query.app_id || '3';

    console.log(`طلب الروابط - config_no: ${configNo}, app_id: ${appId}`);

    const fileName = `urls?config_no=${configNo}&app_id=${appId}`;
    let filePath = path.join(__dirname, fileName);

    if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'urls?config_no=0&app_id=3');
    }

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } else {
        res.status(404).json({ code: 1, msg: 'Urls file not found on server', data: null });
    }
});

// 2. مسار التحميل والبصمات (منطقه الخاص معالجة buffer و MD5)
app.get('/api/v2/download', async (req, res) => {
    const versionDetailId = req.query.versionDetailId;
    const dzCode = req.query.dzCode;

    console.log(`طلب تحميل وإرسال الملف - versionDetailId: ${versionDetailId}, dzCode: ${dzCode}`);

    const filePath = path.join(__dirname, 'download');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ code: 1, msg: 'download file not found on server', data: null });
    }

    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const downloadData = JSON.parse(rawData);

        if (!versionDetailId || !downloadData[versionDetailId]) {
            return res.status(404).json({ code: 1, msg: `Version ID ${versionDetailId} not found`, data: null });
        }

        const item = downloadData[versionDetailId];
        const targetUrl = typeof item === 'string' ? item : item.downloadUrl;
        
        console.log(`جاري جلب الملف من المصدر وإرساله للتطبيق: ${targetUrl}`);

        const remoteResponse = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'arraybuffer',
            timeout: 60000
        });

        const zipBuffer = Buffer.from(remoteResponse.data);
        const calculatedSign = crypto.createHash('md5').update(zipBuffer).digest('hex');

        res.status(200);
        res.setHeader('code', '0');
        res.setHeader('downloadid', '0');
        res.setHeader('sign', calculatedSign);
        res.setHeader('content-type', 'application/octet-stream');
        res.setHeader('content-length', zipBuffer.length);

        return res.send(zipBuffer);

    } catch (err) {
        console.error('خطأ أثناء معالجة وإرسال ملف التحميل:', err.message);
        if (!res.headersSent) {
            return res.status(500).json({ code: 1, msg: 'Server error processing download', data: null });
        }
    }
});

// 3. مسار الخدمات البرمجية الذكي (Diagsoftservice 1 & 2)
app.post('/api/v2/diagsoftservice', (req, res) => {
    const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');
    const targetFileName = requestBody.includes('queryPDTDiagSoftSubPack') ? 'diagsoftservice2' : 'diagsoftservice1';
    const filePath = path.join(__dirname, targetFileName);
    
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.sendFile(filePath);
    } else {
        res.status(404).send('<v:Envelope><v:Body><v:Fault><faultcode>Server</faultcode><faultstring>Not found</faultstring></v:Fault></v:Body></v:Envelope>');
    }
});

// =========================================================================
// 4. مسار ديناميكي عام لأي ملف آخر (login, statistics, url-upload, xml services)
// =========================================================================
app.post('/api/v2/:endpoint', (req, res) => {
    const endpoint = req.params.endpoint;
    const filePath = path.join(__dirname, endpoint);

    console.log(`طلب وارد إلى المسار: /api/v2/${endpoint} -> البحث عن الملف محلياً`);

    if (fs.existsSync(filePath)) {
        // تحديد نوع الترويسة تلقائياً بناءً على امتداد الملف أو طبيعته
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        if (fileContent.trim().startsWith('<')) {
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        } else {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        
        return res.sendFile(filePath);
    } else {
        console.log(`الملف غير موجود في المجلد: ${endpoint}`);
        // الرد بصيغة JSON أو XML بناءً على نوع الطلب المتوقع
        return res.status(404).json({ code: 1, msg: `Endpoint file '${endpoint}' not found`, data: null });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
