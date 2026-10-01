const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
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

// مسار التحميل الداعم لإعادة التوجيه (302) وحقن الترخيص
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
        console.log(`جلب ملف الـ zip الأصلي من الرابط الخارجي: ${targetUrl}`);

        // 1. جلب ملف الـ zip الأصلي
        const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
        
        // 2. قراءة الـ Zip باستخدام jszip
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(response.data);

        // 3. البحث عن مسار مجلد الإصدار المتوافق
        let targetFolderPath = "";
        
        loadedZip.forEach((relativePath, zipEntry) => {
            const match = relativePath.match(/^([\S\s]*?\/([Vv]\d{2}\.\d{2}))\//);
            if (match && !targetFolderPath) {
                targetFolderPath = match[1];
            }
        });

        // تحديد مسار ملف الترخيص الفارغ داخلياً
        const licenseInternalPath = targetFolderPath ? `${targetFolderPath}/LICENSE.DAT` : 'LICENSE.DAT';

        // 4. إضافة ملف LICENSE.DAT فارغ داخل الـ Zip
        loadedZip.file(licenseInternalPath, "");
        console.log(`تم حقن ملف LICENSE.DAT فارغ بنجاح في المسار: ${licenseInternalPath}`);

        // 5. توليد الملف المضغوط الجديد وحفظه مؤخراً على السيرفر لتوفيره عبر رابط مباشر للـ 302
        const modifiedZipBuffer = await loadedZip.generateAsync({ type: 'nodebuffer' });
        const modifiedFileName = `brand_${versionDetailId}.zip`;
        const savedModifiedPath = path.join(__dirname, modifiedFileName);
        
        fs.writeFileSync(savedModifiedPath, modifiedZipBuffer);

        // 6. إرجاع كود 302 مع رابط الملف المعدل على سيرفرك لكي يقوم التطبيق بتحميله بالشكل السليم
        const hostUrl = `${req.protocol}://${req.get('host')}`;
        const redirectTarget = `${hostUrl}/${modifiedFileName}`;
        
        console.log(`إرسال توجيه (302) إلى الرابط: ${redirectTarget}`);
        return res.redirect(302, redirectTarget);

    } catch (err) {
        console.error('خطأ أثناء معالجة وحقن ملف الـ Zip:', err);
        return res.status(500).json({ code: 1, msg: 'Server error processing zip file', data: null });
    }
});

// مسار للسماح بتحميل الملفات المؤقتة الناتجة عن التعديل (مثل الـ zip المعدل)
app.use(express.static(__dirname));

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
