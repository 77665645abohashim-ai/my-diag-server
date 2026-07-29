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
// 2. مسار توفير عناوين السيرفر للتطبيق (URLs Config)
// GET /api/v2/urls
// ==========================================
app.get('/api/v2/urls', (req, res) => {
    const MY_SERVER_DOMAIN = "https://my-diag-server.onrender.com";

    console.log(`[URL CONFIG REQUEST] Config No: ${req.query.config_no || '0'}`);

    // إرجاع عناوين السيرفر المطلوبة للتطبيق
    return res.status(200).json({
        code: 0,
        msg: "success",
        data: {
            urls: {
                auth_url: `${MY_SERVER_DOMAIN}/api/v2/login`,
                public_soft_url: `${MY_SERVER_DOMAIN}/api/v2/publicsoftservice-nt`,
                upload_url: `${MY_SERVER_DOMAIN}/api/v2/url-upload`,
                push_url: `${MY_SERVER_DOMAIN}/api/v2/sysAppMessagePushService`
            }
        }
    });
});

// ==========================================
// 3. مسار تسجيل الدخول مع بياناتك الخاصة
// POST /api/v2/login
// ==========================================
app.post('/api/v2/login', (req, res) => {
    const { login_key, password } = req.body;

    console.log(`[LOGIN ATTEMPT] User: ${login_key}`);

    // البيانات المعتمدة للتسجيل الخاص بك:
    const VALID_USER = '979862374489';
    const VALID_PASS = '77777770z';

    if (login_key === VALID_USER && password === VALID_PASS) {
        console.log(`[LOGIN SUCCESS] Welcome ${login_key}`);
        
        return res.status(200).json({
            code: 0,
            msg: "success",
            data: {
                token: "DIAG_AUTH_TOKEN_979862374489_SUCCESS",
                username: VALID_USER,
                serial_no: "979862374489",
                expire_date: "2030-12-31"
            }
        });
    } else {
        return res.status(200).json({
            code: 100001,
            msg: "Username or password incorrect"
        });
    }
});

// ==========================================
// 4. مسار فحص التحديثات (SOAP / XML)
// POST /api/v2/publicsoftservice-nt
// ==========================================
app.post('/api/v2/publicsoftservice-nt', async (req, res) => {
    try {
        console.log('[UPDATE CHECK REQUEST]');

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
// 5. مسار تقارير التتبع وإحصائيات النقرات
// POST /api/v2/url-upload
// ==========================================
app.post('/api/v2/url-upload', (req, res) => {
    return res.status(200).json({
        code: 0,
        message: "OK"
    });
});

// ==========================================
// 6. مسار خدمة الإشعارات في الخلفية
// POST /api/v2/sysAppMessagePushService
// ==========================================
app.post('/api/v2/sysAppMessagePushService', (req, res) => {
    return res.status(200).json({
        code: 0,
        message: "OK"
    });
});

// ==========================================
// تشغيل السيرفر
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 DiagServer is running on port: ${PORT}`);
});
