const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ----------------------------------------------------
// 1. الإعدادات والوسائط (Middlewares)
// ----------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.text({ type: ['text/xml', 'application/xml', 'text/plain'] }));
app.use(express.urlencoded({ extended: true }));

// مجلد الملفات العامة
app.use('/files', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// طباعة الطلبات الواردة للمراقبة
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
// 4. مسار البرامج العامة الشغال لديك (/api/v2/publicsoftservice-nt)
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
// 5. مسار الماركات المعدل ذكياً (/api/v2/diagsoftservice)
// ----------------------------------------------------
app.all(['/api/v2/diagsoftservice', '/diagsoftservice'], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    const requestBody = String(req.body || '');

    // قائمة الماركات المراد إظهارها
    const brandsList = `
        <item>
            <softPackageId>DEMO</softPackageId>
            <softPackageName>DEMO</softPackageName>
            <version>V15.00</version>
            <url>${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
        </item>
        <item>
            <softPackageId>EOBD2</softPackageId>
            <softPackageName>EOBD2 Protocol</softPackageName>
            <version>V22.80</version>
            <url>${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
        </item>
        <item>
            <softPackageId>TOYOTA</softPackageId>
            <softPackageName>TOYOTA / LEXUS</softPackageName>
            <version>V50.10</version>
            <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
        </item>
        <item>
            <softPackageId>VOLKSWAGEN</softPackageId>
            <softPackageName>VW / AUDI</softPackageName>
            <version>V28.50</version>
            <url>${MY_SERVER_URL}/files/VW_V28.50.zip</url>
        </item>
        <item>
            <softPackageId>BENZ</softPackageId>
            <softPackageName>MERCEDES-BENZ</softPackageName>
            <version>V49.90</version>
            <url>${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
        </item>
        <item>
            <softPackageId>BMW</softPackageId>
            <softPackageName>BMW / MINI</softPackageName>
            <version>V50.00</version>
            <url>${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
        </item>`;

    // التمييز حسب اسم الدالة المطلوبة في جسم الـ SOAP Request
    let responseAction = "queryPDTDiagSoftSubPackResponse";
    if (requestBody.includes("queryLatestDiagSoftsIncrCdn")) {
        responseAction = "queryLatestDiagSoftsIncrCdnResponse";
    }

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:${responseAction}>
            <return>
                <code>0</code>
                <message>success</message>
                <result>
                    ${brandsList}
                </result>
            </return>
        </ns1:${responseAction}>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 6. مسارات الدعم
// ----------------------------------------------------
app.all(['/product-service', '/statistics', '/url-upload', '/register', '/api/v2/*'], (req, res) => {
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
// 7. التشغيل
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Diag Server Online on Port ${PORT}`);
});
