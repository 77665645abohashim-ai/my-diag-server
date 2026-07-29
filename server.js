const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: ['text/xml', 'application/xml'] }));

// بياناتك المعتمدة
const VALID_USER = '979862374489';
const VALID_PASS = '77777770z';

// دالة تصنيع رد الدخول الناجح
const getSuccessLoginResponse = () => ({
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

// 1. مسار عناوين السيرفر
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

// 2. مسار تسجيل الدخول الأول
app.post('/api/v2/login', (req, res) => {
    const { login_key, password, username } = req.body;
    const user = login_key || username;

    console.log(`[LOGIN ATTEMPT] User: ${user}`);

    if ((user === VALID_USER || user === '979862374489') && password === VALID_PASS) {
        return res.status(200).json(getSuccessLoginResponse());
    } else {
        return res.status(200).json({ code: 100001, msg: "Username or password incorrect" });
    }
});

// 3. مسار تسجيل الدخول البديل (في حال كان التطبيق يطلبه)
app.post('/api/v2/user/login', (req, res) => {
    return res.status(200).json(getSuccessLoginResponse());
});

// 4. باقي المسارات (Uploads & Push)
app.post('/api/v2/url-upload', (req, res) => res.status(200).json({ code: 0, message: "OK" }));
app.post('/api/v2/sysAppMessagePushService', (req, res) => res.status(200).json({ code: 0, message: "OK" }));

app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
