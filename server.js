const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/xml', 'application/xml'] }));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running!' });
});

// مسار الروابط
app.get('/api/v2/urls', (req, res) => {
    const configNo = req.query.config_no;
    const appId = req.query.app_id;

    console.log(`طلب الروابط - config_no: ${configNo}, app_id: ${appId}`);

    let filePath = path.join(__dirname, 'urls?config_no=0&app_id=3');
    if (!fs.existsSync(filePath)) filePath = path.join(__dirname, 'softwares.json');
    if (!fs.existsSync(filePath)) filePath = path.join(__dirname, 'urls');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } else {
        res.status(404).json({ code: 1, msg: 'File not found on server', data: null });
    }
});

// مسار التحميل المعدل لجلب الـ etag وتحويله إلى sign وإرساله كـ JSON
app.get('/api/v2/download', async (req, res) => {
    const versionDetailId = req.query.versionDetailId;
    const dzCode = req.query.dzCode;

    console.log(`تم استلام طلب التحميل - versionDetailId: ${versionDetailId}, dzCode: ${dzCode}`);

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

        const targetUrl = downloadData[versionDetailId].downloadUrl;
        let etagSign = "64d4a15d3c4ed9da4f500b8f43dfd33e"; // قيمة افتراضية آمنة احتياطية

        try {
            // جلب الـ etag من الرابط الخارجي بدون تحميل الملف بالكامل
            const headResponse = await axios.head(targetUrl);
            const remoteEtag = headResponse.headers['etag'];
            if (remoteEtag) {
                etagSign = remoteEtag.replace(/["']/g, ""); // تنظيفه من علامات التنصيص
                console.log(`تم استخراج الـ etag وتحويله إلى sign بنجاح: ${etagSign}`);
            }
        } catch (e) {
            console.log('ملاحظة: تعذر جلب الـ etag الخارجي، سيتم استخدام القيمة الافتراضية.');
        }

        console.log(`إرسال استجابة التحميل مع الـ sign إلى الرابط: ${targetUrl}`);

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(200).json({
            code: 0,
            downloadid: 0,
            msg: "success",
            sign: etagSign,
            downloadUrl: targetUrl
        });

    } catch (err) {
        console.error('خطأ أثناء قراءة ملف الـ download:', err);
        return res.status(500).json({ code: 1, msg: 'Server error processing download request', data: null });
    }
});

// باقي المسارات (Login, SOAP, إلخ...)
app.post('/api/v2/login', (req, res) => {
    const filePath = path.join(__dirname, 'login');
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).json({ code: 1, msg: 'Login file not found' });
});

app.post('/api/v2/url-upload', (req, res) => {
    const filePath = path.join(__dirname, 'url-upload');
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).json({ code: 1, msg: 'url-upload file not found' });
});

app.post(['/api/v2/publicsoftservice', '/api/v2/publicsoftservice-nt', '/api/v2/product-service', '/api/v2/diagnosticLog'], (req, res) => {
    const endpoint = req.path.split('/').pop();
    const filePath = path.join(__dirname, endpoint);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.sendFile(filePath);
    } else {
        res.status(404).send('<v:Envelope><v:Body><v:Fault><faultcode>Server</faultcode><faultstring>Not found</faultstring></v:Fault></v:Body></v:Envelope>');
    }
});

app.post('/api/v2/statistics', (req, res) => {
    const filePath = path.join(__dirname, 'statistics');
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).json({ code: 1, msg: 'Not found' });
});

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
