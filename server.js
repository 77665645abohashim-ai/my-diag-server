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

// مجلد الملفات العامة
app.use('/files', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 2. دالة إرجاع SOAP للماركات (موحدة لكل المسارات)
// ----------------------------------------------------
const handleDiagSoapRequest = (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

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
};

// ----------------------------------------------------
// 3. توجيه جميع مسارات طلبات الماركات والـ SOAP المحتملة
// ----------------------------------------------------
app.all([
    '/api/v2/diagsoftservice',
    '/diagsoftservice',
    '/api/v2/download',
    '/download',
    '/api/v2/dlDiagSoftPack',
    '/dlDiagSoftPack.action',
    '/downloaddiagsoftws.action'
], handleDiagSoapRequest);

// ----------------------------------------------------
// 4. مسار الروابط المصحح بالكامل (/urls)
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
                { "key": "publicsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice` },
                { "key": "publicsoftservice.nt", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt` },
                { "key": "x431paddiagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/diagsoftservice` },
                { "key": "downloaddiagsoftws.action", "value": `${MY_SERVER_URL}/api/v2/diagsoftservice` },
                { "key": "dlDiagSoftPack.action", "value": `${MY_SERVER_URL}/api/v2/diagsoftservice` },
                { "key": "publicsoft.download", "value": `${MY_SERVER_URL}/files` },
                { "key": "publicsoft_breakpoint_action", "value": `${MY_SERVER_URL}/files` },
                { "key": "diagsoft_breakpoint_action", "value": `${MY_SERVER_URL}/files` }
            ]
        }
    });
});

// ----------------------------------------------------
// 5. باقي مسارات الـ JSON (تسجيل الدخول والدعم)
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
    console.log(`🚀 Master Diag Server Online on Port ${PORT}`);
});
