const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ----------------------------------------------------
// 1. الإعدادات والوسائط (Middlewares)
// ----------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.text({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));

// مجلد الملفات العامة لتنزيل الـ ZIP والـ APK
app.use('/files', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// طباعة الطلبات الواردة في الـ Console
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 2. مسار البرامج العامة والماركات المدمجة (/publicsoftservice-nt)
// ----------------------------------------------------
app.all([
    '/api/v2/publicsoftservice-nt', 
    '/publicsoftservice-nt', 
    '/publicsoftservice',
    '/api/v2/publicsoftservice'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    console.log("✅ [PUBLICSOFT REQUEST]: Serving Firmware & Brands list");

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
                        <fileSize>15024567</fileSize>
                        <url>${MY_SERVER_URL}/files/Firmware_V11.91.zip</url>
                    </item>
                    <item>
                        <softPackageId>DEMO</softPackageId>
                        <softPackageName>DEMO Program</softPackageName>
                        <version>V15.00</version>
                        <fileSize>1024567</fileSize>
                        <url>${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
                    </item>
                    <item>
                        <softPackageId>EOBD2</softPackageId>
                        <softPackageName>EOBD2 Protocol</softPackageName>
                        <version>V22.80</version>
                        <fileSize>2048567</fileSize>
                        <url>${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
                    </item>
                    <item>
                        <softPackageId>TOYOTA</softPackageId>
                        <softPackageName>TOYOTA / LEXUS</softPackageName>
                        <version>V50.10</version>
                        <fileSize>5048567</fileSize>
                        <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                    </item>
                    <item>
                        <softPackageId>VOLKSWAGEN</softPackageId>
                        <softPackageName>VW / AUDI</softPackageName>
                        <version>V28.50</version>
                        <fileSize>4048567</fileSize>
                        <url>${MY_SERVER_URL}/files/VW_V28.50.zip</url>
                    </item>
                    <item>
                        <softPackageId>BENZ</softPackageId>
                        <softPackageName>MERCEDES-BENZ</softPackageName>
                        <version>V49.90</version>
                        <fileSize>6048567</fileSize>
                        <url>${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
                    </item>
                    <item>
                        <softPackageId>BMW</softPackageId>
                        <softPackageName>BMW / MINI</softPackageName>
                        <version>V50.00</version>
                        <fileSize>5548567</fileSize>
                        <url>${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
                    </item>
                </result>
            </out>
        </queryLatestVersionResponse>
    </soap:Body>
</soap:Envelope>`;

    return res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 3. مسار خدمات SOAP الاحتياطي
// ----------------------------------------------------
app.all([
    '/api/v2/diagsoftservice',
    '/diagsoftservice',
    '/api/v2/download',
    '/download',
    '/downloaddiagsoftws.action'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    const subPackResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <SOAP-ENV:Body>
        <ns1:queryPDTDiagSoftSubPackResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <result>
                    <item>
                        <softPackageId>DEMO</softPackageId>
                        <softPackageName>DEMO Program</softPackageName>
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
        </ns1:queryPDTDiagSoftSubPackResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(subPackResponse);
});

// ----------------------------------------------------
// 4. مسار الروابط الأساسية (/urls)
// ----------------------------------------------------
app.all(['/urls', '/api/v2/urls'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "version": "74",
        "area": "2",
        "data": {
            "urls": [
                { "key": "login", "value": `${MY_SERVER_URL}/login` },
                { "key": "check-token", "value": `${MY_SERVER_URL}/api/v2/product-service` },
                { "key": "productservice.*", "value": `${MY_SERVER_URL}/api/v2/product-service` },
                { "key": "publicsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt` },
                { "key": "publicsoftservice.nt", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt` },
                { "key": "x431paddiagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt` },
                { "key": "downloaddiagsoftws.action", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt` },
                { "key": "publicsoft.download", "value": `${MY_SERVER_URL}/files` }
            ]
        }
    });
});

// ----------------------------------------------------
// 5. باقي المسارات الأساسية
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

app.all('*', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": { "status": "ACTIVE" }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Diag Server Online on Port ${PORT}`);
});
