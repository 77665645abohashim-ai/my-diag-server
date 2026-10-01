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

// مسار التحميل: أخذ الـ etag كاملاً بحرفيته ووضعه في الـ sign دون تغيير قيمته
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

        // استخراج الرابط الخارجي (سواء كان مخزناً كنص مباشر أو داخل كائن)
        const item = downloadData[versionDetailId];
        const targetUrl = typeof item === 'string' ? item : item.downloadUrl;

        let extractedSign = "64d4a15d3c4ed9da4f500b8f43dfd33e"; // قيمة افتراضية احتياطية

        // إذا كان الرابط يشير لسيرفرنا المحلي (لحل حلقة التكرار)، نتجاوز فحص الـ etag الخارجي ونستخدم القيمة المباشرة
        if (targetUrl && targetUrl.includes('/api/v2/download')) {
            console.log('رابط داخلي، سيتم استجابة التوجيه المباشر بدون فحص خارجي.');
        } else {
            try {
                console.log(`فحص الرابط الخارجي لجلب الـ etag تلقائياً: ${targetUrl}`);
                // إرسال طلب HEAD لجلب الترويسات فقط دون تحميل الملف
                const headResponse = await axios.head(targetUrl, { timeout: 8000 });
                
                // البحث عن الـ etag في الترويسات القادمة من السيرفر الخارجي
                const remoteEtag = headResponse.headers['etag'] || headResponse.headers['ETag'];

                if (remoteEtag) {
                    // استخدام قيمة الـ etag الحرفية كما هي تماماً دون أي تعديل
                    extractedSign = remoteEtag;
                    console.log(`نجاح! تم نسخ الـ etag بحرفيته إلى sign: ${extractedSign}`);
                } else {
                    console.log('تنبيه: السيرفر الخارجي لم يرسل etag، سيتم استخدام القيمة الاحتياطية.');
                }
            } catch (e) {
                console.error('خطأ أثناء الاتصال بالسيرفر الخارجي لجلب الـ etag:', e.message);
            }
        }

        // تعيين الروؤس (Headers) المطلوبة تماماً كما يتوقعها التطبيق
        res.setHeader('code', '0');
        res.setHeader('downloadid', '0');
        res.setHeader('sign', extractedSign);

        console.log(`إعادة توجيه الطلب (302) للرابط مع الـ sign الناتج: ${targetUrl}`);
        return res.redirect(302, targetUrl);

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
