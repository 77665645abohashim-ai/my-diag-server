const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. إعدادات استقبال البيانات (Middlewares)
// ==========================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: ['text/xml', 'application/xml'] }));

// البيانات الخاصة بك والمعتمدة
const VALID_USER = '979862374489';
const VALID_PASS = '77777770z';

// رد النجاح القياسي المتوافق مع التطبيق
const getSuccessData = () => ({
    code: 0,
    msg: "success",
    data: {
        token: "DIAG_AUTH_TOKEN_979862374489_SUCCESS",
        user_id: "979862374489",
        username: VALID_USER,
        serial_no: "979862374489",
        cc: "86",
        email: "user@diagzone.com",
        expire_date: "2030-12-31"
    }
});

// ==========================================
// 2. مسار جلب العناوين (URLs Config)
// GET /api/v2/urls
// ==========================================
app.get('/api/v2/urls', (req, res) => {
    const MY_SERVER_DOMAIN = "https://my-diag-server.onrender.com";
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
// 3. مسار تسجيل الدخول المباشر (REST API)
// POST /api/v2/login & /api/v2/user/login
// ==========================================
const handleLogin = (req, res) => {
    const { login_key, password, username, user_name } = req.body || {};
    const inputUser = login_key || username || user_name;
    const inputPass = password;

    console.log(`[LOGIN REQUEST RECEIVED] User: ${inputUser}`);

    // قبول الدخول إذا تطابقت بياناتك، أو قبول أي دخول إذا كان الاختبار بـ 123456
    if ((inputUser === VALID_USER && inputPass === VALID_PASS) || inputUser === '123456') {
        console.log('[LOGIN SUCCESS]');
        return res.status(200).json(getSuccessData());
    } else {
        console.log('[LOGIN FAILED]');
        return res.status(200).json({
            code: 100001,
            msg: "Username or password incorrect"
        });
    }
};

app.post('/api/v2/login', handleLogin);
app.post('/api/v2/user/login', handleLogin);

// ==========================================
// 4. مسار الخدمات والتحديثات والدخول بـ SOAP XML
// POST /api/v2/publicsoftservice-nt
// ==========================================
app.post('/api/v2/publicsoftservice-nt', (req, res) => {
    console.log('[SOAP SERVICE REQUEST]');

    // رد XML متوافق مع كافة خدمات وسيرفرات Diagzone
    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
   <SOAP-ENV:Body>
      <ns1:loginResponse>
         <return>
            <code>0</code>
            <message>success</message>
            <token>DIAG_AUTH_TOKEN_979862374489_SUCCESS</token>
         </return>
      </ns1:loginResponse>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    res.set('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(xmlResponse);
});

// ==========================================
// 5. مسارات التتبع والرسائل (Uploads & Push)
// ==========================================
app.post('/api/v2/url-upload', (req, res) => res.status(200).json({ code: 0, message: "OK" }));
app.post('/api/v2/sysAppMessagePushService', (req, res) => res.status(200).json({ code: 0, message: "OK" }));

// ==========================================
// تشغيل السيرفر
// ==========================================
app.listen(PORT, () => console.log(`🚀 DiagServer active on port: ${PORT}`));
