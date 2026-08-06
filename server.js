const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ----------------------------------------------------
// 1. الإعدادات والوسائط (Middlewares)
// ----------------------------------------------------
app.use(cors());
app.use(express.json());
// قراءة أي محتوى نصي أو XML قادم في جسم الطلب (Body)
app.use(express.text({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));

// مجلد الملفات العامة (لتنزيل ملفات الـ ZIP و الـ APK)
app.use('/files', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// طباعة الطلبات الواردة للمراقبة والديباج
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 2. مسار الروابط الأساسية (/urls)
// ----------------------------------------------------
app.all(['/urls', '/api/v2/urls'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "publicsoft.download": `${MY_SERVER_URL}/files`,
            "downloaddiagsoftws.action": `${MY_SERVER_URL}/api/v2/diagsoftservice`,
            "publicsoftws.action": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt`,
            "login.action": `${MY_SERVER_URL}/login`,
            "register.action": `${MY_SERVER_URL}/register`
        }
    });
});

// ----------------------------------------------------
// 3. مسار تسجيل الدخول (/login)
// ----------------------------------------------------
app.all('/login', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "token": "YmxrVCtaaEVJNWUrWWhhcVY5VHIvdz09",
            "user_id": "10001",
            "username": "DiagZoneVIP"
        }
    });
});

// ----------------------------------------------------
// 4. مسار البرامج العامة (/api/v2/publicsoftservice-nt)
// ----------------------------------------------------
app.all(['/api/v2/publicsoftservice-nt', '/publicsoftservice-nt', '/publicsoftservice'], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    const xmlResponse = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <queryLatestVersionResponse xmlns="http://service.publicsoft.cc.com">
            <out>
                <code>0</code>
                <message>success</message>
                <result>
                    <item>
                        <softPackageId>Firmware</softPackageId>
                        <softPackageName>Firmware</softPackageName>
                        <version>V11.91</version>
                        <url>${MY_SERVER_URL}/files/Firmware_V11.91.zip</url>
                    </item>
                    <item>
                        <softPackageId>Diagzone PRO V2</softPackageId>
                        <softPackageName>Diagzone PRO V2</softPackageName>
                        <version>V2.00.033</version>
                        <url>${MY_SERVER_URL}/files/DiagPro_V2.apk</url>
                    </item>
                </result>
            </out>
        </queryLatestVersionResponse>
    </soap:Body>
</soap:Envelope>`;

    res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 5. مسار الماركات والبرمجيات الفرعية الصريح (/api/v2/diagsoftservice)
// ----------------------------------------------------
app.all(['/api/v2/diagsoftservice', '/diagsoftservice'], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    console.log("=== DIAGSOFTSERVICE REQUEST RECEIVED ===");

    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');

    // 1️⃣ معالجة طلب queryPDTDiagSoftSubPack الفعلي
    if (rawBody.includes("queryPDTDiagSoftSubPack")) {
        const subPackResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryPDTDiagSoftSubPackResponse>
            <return xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="ns1:DiagSoftSubPack[6]">
                <item>
                    <spfId xsi:type="xsd:string">1001</spfId>
                    <softPackageId xsi:type="xsd:string">DEMO</softPackageId>
                    <softPackageName xsi:type="xsd:string">DEMO Program</softPackageName>
                    <version xsi:type="xsd:string">V15.00</version>
                    <vNum xsi:type="xsd:string">1500</vNum>
                    <fileSize xsi:type="xsd:string">1024567</fileSize>
                    <url xsi:type="xsd:string">${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
                </item>
                <item>
                    <spfId xsi:type="xsd:string">1002</spfId>
                    <softPackageId xsi:type="xsd:string">EOBD2</softPackageId>
                    <softPackageName xsi:type="xsd:string">EOBD2 Protocol</softPackageName>
                    <version xsi:type="xsd:string">V22.80</version>
                    <vNum xsi:type="xsd:string">2280</vNum>
                    <fileSize xsi:type="xsd:string">2048567</fileSize>
                    <url xsi:type="xsd:string">${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
                </item>
                <item>
                    <spfId xsi:type="xsd:string">1003</spfId>
                    <softPackageId xsi:type="xsd:string">TOYOTA</softPackageId>
                    <softPackageName xsi:type="xsd:string">TOYOTA / LEXUS</softPackageName>
                    <version xsi:type="xsd:string">V50.10</version>
                    <vNum xsi:type="xsd:string">5010</vNum>
                    <fileSize xsi:type="xsd:string">5048567</fileSize>
                    <url xsi:type="xsd:string">${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                </item>
                <item>
                    <spfId xsi:type="xsd:string">1004</spfId>
                    <softPackageId xsi:type="xsd:string">VOLKSWAGEN</softPackageId>
                    <softPackageName xsi:type="xsd:string">VW / AUDI</softPackageName>
                    <version xsi:type="xsd:string">V28.50</version>
                    <vNum xsi:type="xsd:string">2850</vNum>
                    <fileSize xsi:type="xsd:string">4048567</fileSize>
                    <url xsi:type="xsd:string">${MY_SERVER_URL}/files/VW_V28.50.zip</url>
                </item>
                <item>
                    <spfId xsi:type="xsd:string">1005</spfId>
                    <softPackageId xsi:type="xsd:string">BENZ</softPackageId>
                    <softPackageName xsi:type="xsd:string">MERCEDES-BENZ</softPackageName>
                    <version xsi:type="xsd:string">V49.90</version>
                    <vNum xsi:type="xsd:string">4990</vNum>
                    <fileSize xsi:type="xsd:string">6048567</fileSize>
                    <url xsi:type="xsd:string">${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
                </item>
                <item>
                    <spfId xsi:type="xsd:string">1006</spfId>
                    <softPackageId xsi:type="xsd:string">BMW</softPackageId>
                    <softPackageName xsi:type="xsd:string">BMW / MINI</softPackageName>
                    <version xsi:type="xsd:string">V50.00</version>
                    <vNum xsi:type="xsd:string">5000</vNum>
                    <fileSize xsi:type="xsd:string">5548567</fileSize>
                    <url xsi:type="xsd:string">${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
                </item>
            </return>
        </ns1:queryPDTDiagSoftSubPackResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
        return res.status(200).send(subPackResponse);
    }

    // 2️⃣ الرد الاحتياطي لأي طلب SOAP آخر قادم للمسار
    const defaultResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
    <SOAP-ENV:Body>
        <ns1:queryLatestDiagSoftsResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <result>
                    <item>
                        <softPackageId>DEMO</softPackageId>
                        <softPackageName>DEMO</softPackageName>
                        <version>V15.00</version>
                        <url>${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
                    </item>
                    <item>
                        <softPackageId>TOYOTA</softPackageId>
                        <softPackageName>TOYOTA / LEXUS</softPackageName>
                        <version>V50.10</version>
                        <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                    </item>
                </result>
            </return>
        </ns1:queryLatestDiagSoftsResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(defaultResponse);
});

// ----------------------------------------------------
// 6. مسارات الدعم الفردية (بدون استخدام Wildcards عشوائية)
// ----------------------------------------------------
app.all([
    '/product-service', 
    '/api/v2/product-service', 
    '/statistics', 
    '/api/v2/statistics', 
    '/url-upload', 
    '/api/v2/url-upload', 
    '/register'
], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "dzKey": "8888888888888888",
            "status": "ACTIVE"
        }
    });
});

// ----------------------------------------------------
// 7. تشغيل السيرفر
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Diag Server Online on Port ${PORT}`);
});
