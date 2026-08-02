const express = require('express');
const app = express();

// إعدادات قراءة البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/xml', 'application/xml', '*/*'] }));

// ضبط الهيدر التلقائي للردود
app.use((req, res, next) => {
    if (req.body && typeof req.body === 'string' && req.body.includes('Envelope')) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    } else {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
});

// ==========================================
// 1. قسم مسار تسجيل الدخول (Login Route)
// ==========================================
app.post('/api/v2/login', (req, res) => {
    console.log("[LOGIN] Request received");
    const SERIAL_NUMBER = "979862374489";
    const mockToken = "dz_token_979862374489_session";

    return res.status(200).json({
        code: 0,
        msg: "action success",
        token: mockToken,
        data: {
            token: mockToken,
            access_token: mockToken,
            user: {
                user_id: "10001",
                user_name: "979862374489",
                nick_name: "979862374489",
                token: mockToken,
                user_type: "1",
                status: "1"
            },
            deviceUser: {
                serialNo: SERIAL_NUMBER,
                serial_no: SERIAL_NUMBER,
                serial_number: SERIAL_NUMBER
            },
            loginUser: {
                user_name: "979862374489",
                nick_name: "979862374489"
            }
        }
    });
});

// ==========================================
// 2. قسم مسار الإحصائيات والتفعيل (Statistics / VCI Route)
// ==========================================
app.post('/api/v2/statistics', (req, res) => {
    console.log("[STATISTICS] Request received");
    return res.status(200).json({
        code: 0,
        msg: "success",
        data: {
            user_id: 10001,
            bool: "1",
            status: "1",
            is_active: "1"
        }
    });
});

// ==========================================
// 3. قسم طلبات الـ SOAP وجلب الماركات (SOAP Service Route)
// ==========================================
app.all('/api/v2/soap', (req, res) => {
    console.log("[SOAP] Request received for brands/products");
    const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:getRegisteredProductsForPad46Response xmlns:ns1="https://diagzone.com">
            <getRegisteredProductsForPad46Return>
                <item>
                    <softCode>DEMO</softCode>
                    <softName>DEMO V15.86</softName>
                    <expireDate>2099-12-31</expireDate>
                    <status>1</status>
                    <type>PRO</type>
                    <version>15.86</version>
                </item>
            </getRegisteredProductsForPad46Return>
        </ns1:getRegisteredProductsForPad46Response>
    </soap:Body>
</soap:Envelope>`;

    return res.status(200).send(soapXmlResponse);
});

// مسار افتراضي لاختبار السيرفر
app.get('/', (req, res) => {
    res.send("DiagZone Single-File Server is Running Successfully!");
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
