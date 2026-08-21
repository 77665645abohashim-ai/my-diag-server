const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MY_DOMAIN = 'http://localhost:3000'; // ضع عنوان سيرفرك المحلي أو رابط الشبكة هنا

// إعدادات قراءة البيانات
app.use(bodyParser.text({ type: ['text/xml', 'application/xml', 'text/plain'] }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =========================================================================
// 1. مسارات التهيئة والروابط الأساسية (Config & URLs)
// =========================================================================
app.all(['/', '/api/v2/config', '/api/v2/urls'], (req, res) => {
    console.log('[+] Config/URLs requested');
    res.json({
        "code": 0,
        "msg": "success",
        "version": "74",
        "data": {
            "urls": [
                { "key": "login", "value": `${MY_DOMAIN}/api/v2/login` },
                { "key": "check-token", "value": `${MY_DOMAIN}/api/v2/check-token` },
                { "key": "downdsfrag", "value": `${MY_DOMAIN}/api/v2/download` },
                { "key": "activation", "value": `${MY_DOMAIN}/api/v2/activation` },
                { "key": "diagsoftservice", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` }
            ]
        }
    });
});

// =========================================================================
// 2. نقطة تسجيل الدخول (Login Endpoint)
// =========================================================================
app.all(['/api/v2/login', '/login.action'], (req, res) => {
    console.log('[+] Login request received');
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "token": "eGw0Ymhqa1BHRXdNVnJoT2tOV2pXUT09",
            "user": { 
                "user_id": "H21J4WOO", 
                "user_name": "979862374489" 
            }
        }
    });
});

// =========================================================================
// 3. التحقق من التوكن (Check Token Endpoint)
// =========================================================================
app.all('/api/v2/check-token', (req, res) => {
    console.log('[+] Check-Token request received');
    res.json({ 
        "code": 0, 
        "msg": "success", 
        "data": { "isValid": true } 
    });
});

// =========================================================================
// 4. التفعيل والرخص (Activation Endpoint)
// =========================================================================
app.all('/api/v2/activation', (req, res) => {
    console.log('[+] Activation request received');
    res.json({
        "code": 0,
        "msg": "OK",
        "data": { 
            "activationCode": "cW9VVEdobWZwdjQxNkZTeG51emRuZz09" 
        }
    });
});

// =========================================================================
// 5. الاستعلام عن التحديثات (SOAP API - queryLatestDiagSoftsIncrCdn)
// =========================================================================
app.post('/api/v2/diagsoftservice', (req, res) => {
    console.log('[+] SOAP Query Request Received (diagsoftservice)');
    
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <SOAP-ENV:Body>
    <ns1:queryLatestDiagSoftsIncrCdn>
      <return>
        <code>0</code>
        <message>success</message>
        <x431PadSoftIncrList>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>55740637</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>AR</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>69</softId>
            <softName>Demo</softName>
            <softPackageID>DEMO</softPackageID>
            <softUpdateTime>2026-03-04 10:32:08</softUpdateTime>
            <versionDetailId>380901</versionDetailId>
            <versionNo>V15.68</versionNo>
          </x431PadSoftIncr>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>18979371</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>EN</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>92</softId>
            <softName>ECUAID</softName>
            <softPackageID>ECUAID</softPackageID>
            <softUpdateTime>2025-12-08 16:02:02</softUpdateTime>
            <versionDetailId>366146</versionDetailId>
            <versionNo>V12.11</versionNo>
          </x431PadSoftIncr>
        </x431PadSoftIncrList>
      </return>
    </ns1:queryLatestDiagSoftsIncrCdn>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    res.status(200).send(soapResponse);
});

// =========================================================================
// 6. نقطة التحميل وبث الملفات (Download Endpoint with Stream Support)
// =========================================================================
app.get('/api/v2/download', (req, res) => {
    const { versionDetailId, serialNo } = req.query;
    console.log(`[+] Download requested -> VersionID: ${versionDetailId}, SerialNo: ${serialNo}`);

    // مسار مجلد الحزم المضغوطة على جهازك (تأكد من إنشاء مجلد packages وضع بدايته الملفات مسمّاة برقم versionDetailId.zip)
    const filePath = path.join(__dirname, 'packages', `${versionDetailId}.zip`);

    if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);

        // ضبط الروؤس (Headers) بدقة لكي يتعرف التطبيق على الحجم ويبدأ التحميل فوراً دون تعليق
        res.setHeader('Content-Type', 'application/octet-stream;charset=UTF-8');
        res.setHeader('Content-Length', stat.size); // الحجم الفعلي للبايتات (مهم جداً لتجنب انتظار التطبيق)
        res.setHeader('code', '0');
        res.setHeader('downloadid', '852743795');
        res.setHeader('sign', '30e0d3eaed78af141d079375e0f59b0c');
        res.setHeader('Content-Disposition', `attachment; filename="soft_${versionDetailId}.zip"`);

        // بث الملف تدريجياً (Streaming)
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    } else {
        console.log(`[-] File not found for VersionID: ${versionDetailId}`);
        res.status(404).json({ code: 1, message: "File not found on local server" });
    }
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`[🚀] Complete Diagnostic Server is running and listening on port ${PORT}`);
});
