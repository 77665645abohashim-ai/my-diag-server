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

// Root Route
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

// مسار التحميل المحدث: مطابقة ذكية للـ versionDetailId وفك تشفير dzCode وحقن توقيع Diagzone
app.get('/api/v2/download', async (req, res) => {
    const versionDetailId = req.query.versionDetailId;
    const dzCode = req.query.dzCode;

    console.log(`طلب تحميل مع الحقن - versionDetailId: ${versionDetailId}, dzCode: ${dzCode}`);

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

        // قاموس المطابقة الذكي للربط بناءً على ردود SOAP الخاصة بالتطبيق
        const softMapping = {
            "380901": { brand: "Demo", version: "V15.68" },
            "367837": { brand: "BMS_DEMO", version: "V15.55" },
            "381744": { brand: "EV_DEMO", version: "V15.68" },
            "363814": { brand: "MT_DEMO", version: "V10.11" },
            "366146": { brand: "ECUAID", version: "V12.11" },
            "362272": { brand: "EOBD2", version: "V10.28" },
            "365206": { brand: "AUTOSEARCH", version: "V11.15" },
            "362469": { brand: "HD_AUTOSEARCH", version: "V10.85" }
        };

        // محاولة فك تشفير dzCode في حال ورد كـ Base64
        let decodedDzCode = dzCode;
        if (dzCode && dzCode.length > 10 && !dzCode.includes(' ')) {
            try {
                const buff = Buffer.from(dzCode, 'base64');
                const tempDecoded = buff.toString('utf-8');
                if (/^[a-zA-Z0-9_\-]+$/.test(tempDecoded)) {
                    decodedDzCode = tempDecoded;
                }
            } catch (e) {
                // في حال حدوث خطأ أثناء الفك يتم الاحتفاظ بالقيم الافتراضية
            }
        }

        // تحديد اسم الماركة والإصدار والتوقيع بدقة
        let brandName = "EOBD2";
        let version = "12.11";

        if (softMapping[versionDetailId]) {
            brandName = softMapping[versionDetailId].brand;
            version = softMapping[versionDetailId].version;
        } else if (typeof item === 'object' && item.brand) {
            brandName = item.brand;
            version = item.version || "12.11";
        } else if (decodedDzCode && decodedDzCode.length <= 20) {
            brandName = decodedDzCode;
        }

        const fileSign = (typeof item === 'object' && item.sign) ? item.sign : "64d4a15d3c4ed9da4f500b8f43dfd33e";

        console.log(`جاري جلب الملف وحقن التوقيع للماركة: ${brandName} (إصدار: ${version})`);

        // جلب الملف كـ ArrayBuffer للتعديل على بايتات ذيل الـ ZIP
        const remoteResponse = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'arraybuffer',
            timeout: 60000
        });

        let zipBuffer = Buffer.from(remoteResponse.data);

        // الرقم التسلسلي الثابت
        const serialNumber = '979862374489';

        // صياغة نص توقيع Diagzone المطلوب بدقة
        const commentText = `FrmDZX431-X431+1+English+${brandName}+${brandName}+${version}+${serialNumber}+%DIAGZONE-ONLINE-V01+073`;
        const commentBuffer = Buffer.from(commentText, 'utf-8');

        // البحث عن توقيع نهاية الـ ZIP القياسي (EOCD signature: 50 4B 05 06)
        const eocdSignature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
        const eocdIndex = zipBuffer.lastIndexOf(eocdSignature);

        if (eocdIndex !== -1) {
            // تحديث طول حقل التعليق (Comment Length) في ترويسة EOCD (عند الموقع + 20)
            zipBuffer.writeUInt16LE(commentBuffer.length, eocdIndex + 20);
            
            // دمج الـ ZIP الأصلي مع نص التوقيع الجديد في الذيل
            zipBuffer = Buffer.concat([zipBuffer.slice(0, eocdIndex + 22), commentBuffer]);
            console.log(`تم حقن التوقيع بنجاح في ذيل ملف الـ ZIP للماركة: ${brandName}`);
        } else {
            console.log('تحذير: لم يتم العثور على توقيع EOCD في ملف الـ ZIP، تم تجنب الحقن.');
        }

        // ضبط الترويسات وإرسال الملف المعدل
        res.status(200);
        res.setHeader('code', '0');
        res.setHeader('downloadid', '0');
        res.setHeader('sign', fileSign);
        res.setHeader('content-type', 'application/octet-stream');
        res.setHeader('content-length', zipBuffer.length);

        res.send(zipBuffer);

    } catch (err) {
        console.error('خطأ أثناء معالجة ملف التحميل:', err.message);
        if (!res.headersSent) {
            return res.status(500).json({ code: 1, msg: 'Server error processing download', data: null });
        }
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
