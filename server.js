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

// مجلد الملفات العامة لتنزيل التحديثات والماركات
app.use('/files', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// طباعة الطلبات الواردة للمراقبة
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 2. مسار توجيه الروابط الأساسية (/urls)
// ----------------------------------------------------
app.all(['/urls', '/api/v2/urls'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "publicsoft.download": `${MY_SERVER_URL}/files`,
            "downloaddiagsoftws.action": `${MY_SERVER_URL}/api/v2/diagsoftservice`,
            "publicsoftws.action": `${MY_SERVER_URL}/api/v2/publicsoftservice`,
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
// 4. مسار الماركات والتحديثات (/api/v2/diagsoftservice)
// ----------------------------------------------------
app.all(['/api/v2/diagsoftservice', '/diagsoftservice'], (req, res) => {
    res.set('Content-Type', 'text/xml; charset=utf-8');

    // الهيكل الصحيح تماماً الذي ينتظره التطبيق لتفكيك حزم الماركات
    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryPDTDiagSoftSubPackResponse>
            <queryPDTDiagSoftSubPackResult>
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
                    </item>
                    <item>
                        <softPackageId>HYUNDAI</softPackageId>
                        <softPackageName>HYUNDAI</softPackageName>
                        <version>V51.00</version>
                        <url>${MY_SERVER_URL}/files/HYUNDAI_V51.00.zip</url>
                    </item>
                    <item>
                        <softPackageId>KIA</softPackageId>
                        <softPackageName>KIA</softPackageName>
                        <version>V45.00</version>
                        <url>${MY_SERVER_URL}/files/KIA_V45.00.zip</url>
                    </item>
                </result>
            </queryPDTDiagSoftSubPackResult>
        </ns1:queryPDTDiagSoftSubPackResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 5. مسار البرامج العامة والتطبيق (/api/v2/publicsoftservice)
// ----------------------------------------------------
app.all(['/api/v2/publicsoftservice', '/publicsoftservice', '/publicsoftservice-nt'], (req, res) => {
    res.set('Content-Type', 'text/xml; charset=utf-8');

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <SOAP-ENV:Body>
        <ns1:getLatestVersionResponse>
            <getLatestVersionResult>
                <code>0</code>
                <message>success</message>
                <version>2.00.033</version>
                <downloadUrl>${MY_SERVER_URL}/files/DiagPro_V2.apk</downloadUrl>
            </getLatestVersionResult>
        </ns1:getLatestVersionResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 6. مسارات الخدمات المساندة
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
// 7. تشغيل السيرفر
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Diag Server Active on Port: ${PORT}`);
    console.log(`=================================`);
});
