const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. إعدادات استقبال البيانات (Middlewares)
// ==========================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: ['text/xml', 'application/xml'] }));

// ==========================================
// 2. مسار تسجيل الدخول
// POST /api/v2/login
// ==========================================
app.post('/api/v2/login', (req, res) => {
    const { login_key, password } = req.body;

    console.log(`[LOGIN REQUEST] User: ${login_key}`);

    // محاكاة بيانات الدخول (الحساب الصحيح: admin / 123456)
    if (login_key === 'admin' && password === '123456') {
        return res.status(200).json({
            code: 0,
            msg: "success",
            token: "DIAG_AUTH_TOKEN_SAMPLE_12345"
        });
    } else {
        // الرد الذي يُرجعه سيرفر دياقزون عند الخطأ
        return res.status(200).json({
            code: 100001,
            msg: "Username or password incorrect"
        });
    }
});

// ==========================================
// 3. مسار فحص التحديثات (SOAP / XML)
// POST /api/v2/publicsoftservice-nt
// ==========================================
app.post('/api/v2/publicsoftservice-nt', async (req, res) => {
    try {
        const xmlData = req.body;
        console.log('[UPDATE CHECK REQUEST RECEIVED]');

        // محاكاة نفس رد الـ SOAP XML الذي يرسله سيرفر دياقزون
        const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
   <SOAP-ENV:Body>
      <ns1:getMaxVersionForMobileAppCDN>
         <return>
            <code>0</code>
            <message>success</message>
            <appSoftSoftMaxVersion></appSoftSoftMaxVersion>
         </return>
      </ns1:getMaxVersionForMobileAppCDN>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

        res.set('Content-Type', 'text/xml; charset=utf-8');
        return res.status(200).send(xmlResponse);

    } catch (error) {
        console.error("XML Error:", error);
        return res.status(500).send("Error processing XML");
    }
});

// ==========================================
// 4. مسار تقارير التتبع وإحصائيات النقرات
// POST /api/v2/url-upload
// ==========================================
app.post('/api/v2/url-upload', (req, res) => {
    const { url, serialNo } = req.body;
    console.log(`[TELEMETRY LOG] Event: ${url} | Serial: ${serialNo || 'None'}`);

    // الرد القياسي لسيرفر دياقزون
    return res.status(200).json({
        code: 0,
        message: "OK"
    });
});

// ==========================================
// 5. مسار خدمة الإشعارات في الخلفية
// POST /api/v2/sysAppMessagePushService
// ==========================================
app.post('/api/v2/sysAppMessagePushService', (req, res) => {
    console.log('[PUSH SERVICE LOG]');

    return res.status(200).json({
        code: 0,
        message: "OK"
    });
});

// ==========================================
// تشغيل السيرفر
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 DiagServer active on port: ${PORT}`);
});
