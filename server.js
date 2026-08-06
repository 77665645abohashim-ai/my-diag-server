const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ----------------------------------------------------
// 1. الإعدادات والوسائط (Middlewares)
// ----------------------------------------------------
app.use(cors());
app.use(express.json());
// قراءة أي محتوى نصي أو XML قادم في جسم الطلب مهما كان نوع الـ Header
app.use(express.text({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));

// مجلد الملفات العامة لتنزيل الـ ZIP والـ APK
app.use('/files', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// طباعة الطلبات الواردة في الـ Console للـ Debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 2. دالة الـ SOAP الديناميكية (تكتشف الدالة المطلوبة وتغلف الرد بها)
// ----------------------------------------------------
const handleDiagSoapRequest = (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');

    // قراءة الدالة المطلوبة من جسم الطلب
    let actionName = "queryPDTDiagSoftSubPackResponse";
    if (rawBody.includes("queryLatestDiagSoftsIncrCdn")) {
        actionName = "queryLatestDiagSoftsIncrCdnResponse";
    } else if (rawBody.includes("queryLatestDiagSofts")) {
        actionName = "queryLatestDiagSoftsResponse";
    } else if (rawBody.includes("queryPDTDiagSoftSubPack")) {
        actionName = "queryPDTDiagSoftSubPackResponse";
    }

    console.log(`✅ [SOAP ACTION MATCHED]: ${actionName}`);

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:${actionName}>
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
        </ns1:${actionName}>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(xmlResponse);
};

// ----------------------------------------------------
// 3. مسارات طلبات الماركات والـ SOAP (شاملة لجميع المسارات المحتملة)
// ----------------------------------------------------
app.all([
    '/api/v2/diagsoftservice',
    '/diagsoftservice',
    '/api/v2/download',
    '/download',
    '/api/v2/dlDiagSoftPack',
    '/dlDiagSoftPack.action',
    '/downloaddiagsoftws.action',
    '/api/v2/x431paddiagsoftservice'
], handleDiagSoapRequest);

// ----------------------------------------------------
// 4. مسار الروابط المصحح (/urls)
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
// 5. مسار البرامج العامة (/publicsoftservice-nt)
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
// 6. مسار تسجيل الدخول (/login)
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
// 7. باقي مسارات الـ JSON العامة (تجنب سقوط الطلبات في الخطأ)
// ----------------------------------------------------
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
