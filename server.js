const express = require('express');
const app = express();

// إعداد خوادم القراءة لقراءة بيانات Form-Data و JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// تعطيل ضغط البيانات (Gzip) وإضافة الهيدرات الأساسية لكل الطلبات
app.use((req, res, next) => {
    // إزالة هيدر التشفير بالضغط لضمان وصول JSON صريح للتطبيق
    res.removeHeader('Content-Encoding');
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// =========================================================================
// 1. مسار الفحص المبدئي للأصدار والخدمات (SOAP XML)
// =========================================================================
app.post('/api/v2/publicsoftservice-nt', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
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

    return res.status(200).send(soapResponse);
});

// =========================================================================
// 2. مسار التوجيه وجلب الروابط التشغيلية (url-upload)
// =========================================================================
app.post('/api/v2/url-upload', (req, res) => {
    console.log("استلام طلب url-upload:", req.body);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // إرجاع JSON صريح غير مضغوط يحدد رابط تسجيل الدخول
    return res.status(200).send(JSON.stringify({
        code: 0,
        msg: "action success",
        data: {
            url: "https://my-diag-server.onrender.com/api/v2/login"
        }
    }));
});

// =========================================================================
// 3. مسار تحديث ذاكرة الروابط والتكوين (urls)
// =========================================================================
app.post('/api/v2/urls', (req, res) => {
    console.log("استلام طلب قائمة الروابط الرئيسية /api/v2/urls");

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    return res.status(200).send(JSON.stringify({
        code: 0,
        msg: "success",
        data: {
            version: "1.0.0",
            area: "CN",
            urls: [
                "https://my-diag-server.onrender.com"
            ]
        }
    }));
});

// =========================================================================
// 4. مسار تسجيل الدخول الرئيسي (Login)
// =========================================================================
app.post('/api/v2/login', (req, res) => {
    const { login_key, password } = req.body;
    console.log(`محاولة تسجيل دخول للمستخدم: ${login_key}`);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    return res.status(200).send(JSON.stringify({
        code: 0,
        msg: "success",
        data: {
            token: "custom_session_token_99887766554433",
            username: login_key || "User",
            user_id: "10001",
            status: "active"
        }
    }));
});

// =========================================================================
// تشغيل السيرفر على البورت المحدد من بيئة Render
// =========================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل بنجاح على البورت ${PORT}`);
});
