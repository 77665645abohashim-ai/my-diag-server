const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/xml', 'application/xml'] }));

// 1. المسار الرئيسي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.json({ status: 'Server is running successfully', time: new Date() });
});

// 2. مسار جلب الروابط (urls)
app.get('/api/v2/urls', (req, res) => {
    const configNo = req.query.config_no;
    const appId = req.query.app_id;

    console.log(`طلب الروابط - config_no: ${configNo}, app_id: ${appId}`);

    let filePath = path.join(__dirname, 'urls');
    if (!fs.existsSync(filePath)) filePath = path.join(__dirname, 'softwares.json');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } else {
        res.status(404).json({ code: 1, msg: 'Urls file not found on server', data: null });
    }
});

// 3. مسار التحميل المعدل (توجيه مباشر سريع إلى GitHub)
app.get('/api/v2/download', (req, res) => {
    const versionDetailId = req.query.versionDetailId;
    const dzCode = req.query.dzCode;

    console.log(`طلب تحميل جديد - versionDetailId: ${versionDetailId}, dzCode: ${dzCode}`);

    const filePath = path.join(__dirname, 'download');

    if (!fs.existsSync(filePath)) {
        console.error('ملف download غير موجود على السيرفر');
        return res.status(404).json({ code: 1, msg: 'download file not found on server', data: null });
    }

    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const downloadData = JSON.parse(rawData);

        if (!versionDetailId || !downloadData[versionDetailId]) {
            console.error(`رقم الإصدار غير موجود داخل ملف download: ${versionDetailId}`);
            return res.status(404).json({ code: 1, msg: `Version ID ${versionDetailId} not found`, data: null });
        }

        const item = downloadData[versionDetailId];
        const targetUrl = typeof item === 'string' ? item : item.downloadUrl;

        if (!targetUrl) {
            return res.status(404).json({ code: 1, msg: 'Download URL is missing', data: null });
        }

        console.log(`إعادة توجيه فورية (Redirect) إلى رابط GitHub: ${targetUrl}`);
        return res.redirect(302, targetUrl);

    } catch (err) {
        console.error('خطأ أثناء قراءة ملف الـ JSON أو معالجة التوجيه:', err.message);
        if (!res.headersSent) {
            return res.status(500).json({ code: 1, msg: 'Server error processing download', data: null });
        }
    }
});

// 4. مسار تسجيل الدخول (login)
app.post('/api/v2/login', (req, res) => {
    const filePath = path.join(__dirname, 'login');
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).json({ code: 1, msg: 'Login file not found' });
});

// 5. مسار رفع الروابط (url-upload)
app.post('/api/v2/url-upload', (req, res) => {
    const filePath = path.join(__dirname, 'url-upload');
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).json({ code: 1, msg: 'url-upload file not found' });
});

// 6. مسارات الخدمات العامة والإحصائيات (SOAP / XML)
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

// 7. مسار الإحصائيات (statistics)
app.post('/api/v2/statistics', (req, res) => {
    const filePath = path.join(__dirname, 'statistics');
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).json({ code: 1, msg: 'Not found' });
});

// 8. مسار خدمات التشخيص (diagsoftservice)
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
    console.log(`السيرفر يعمل الآن على البورت ${PORT}`);
});
