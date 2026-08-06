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

// مجلد الملفات العامة لتنزيل ملفات الـ ZIP والـ APK
app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.use('/api/v2/download', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// طباعة الطلبات الواردة للـ Debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 2. مسار البرامج العامة (Firmware + التطبيق الأساسي)
// ----------------------------------------------------
app.all([
    '/api/v2/publicsoftservice-nt', 
    '/publicsoftservice-nt', 
    '/publicsoftservice',
    '/api/v2/publicsoftservice'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    console.log("✅ [PUBLICSOFT]: Serving Firmware & App");

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
    <SOAP-ENV:Body>
        <ns1:queryLatestPublicSoftsResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <x431PadSoftList>
                    <x431PadSoft>
                        <softId>873</softId>
                        <softName>Firmware</softName>
                        <softPkgName>Firmware</softPkgName>
                        <softPackageID>DOWNLOAD</softPackageID>
                        <versionNo>V11.91</versionNo>
                        <versionDetailId>343730</versionDetailId>
                        <fileSize>393300</fileSize>
                        <softType>0</softType>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2023-03-27 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/Firmware_V11.91.zip</url>
                    </x431PadSoft>
                    <x431PadSoft>
                        <softId>1015</softId>
                        <softName>Diagzone PRO V2</softName>
                        <softPkgName>Diagzone PRO V2</softPkgName>
                        <softPackageID>Diagzone_PRO_V2</softPackageID>
                        <versionNo>V2.00.033</versionNo>
                        <versionDetailId>359645</versionDetailId>
                        <fileSize>68365802</fileSize>
                        <softType>0</softType>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2025-03-08 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/DiagPro_V2.apk</url>
                    </x431PadSoft>
                </x431PadSoftList>
            </return>
        </ns1:queryLatestPublicSoftsResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 3. مسار الماركات والبرمجيات (المسار الصحيح حسب الـ URLs: /api/v2/diagsoftservice)
// ----------------------------------------------------
app.all([
    '/api/v2/diagsoftservice',
    '/diagsoftservice'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    console.log("✅ [DIAGSOFT SERVICE]: Serving Car Brands List");

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
    <SOAP-ENV:Body>
        <ns1:queryLatestDiagSoftsIncrCdnResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <diagSoftList>
                    <item>
                        <softId>2001</softId>
                        <softPackageId>DEMO</softPackageId>
                        <softPackageName>DEMO</softPackageName>
                        <version>V15.00</version>
                        <versionDetailId>500001</versionDetailId>
                        <fileSize>1024567</fileSize>
                        <url>${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
                    </item>
                    <item>
                        <softId>2002</softId>
                        <softPackageId>EOBD2</softPackageId>
                        <softPackageName>EOBD2 Protocol</softPackageName>
                        <version>V22.80</version>
                        <versionDetailId>500002</versionDetailId>
                        <fileSize>2048567</fileSize>
                        <url>${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
                    </item>
                    <item>
                        <softId>2003</softId>
                        <softPackageId>TOYOTA</softPackageId>
                        <softPackageName>TOYOTA / LEXUS</softPackageName>
                        <version>V50.10</version>
                        <versionDetailId>500003</versionDetailId>
                        <fileSize>5048567</fileSize>
                        <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                    </item>
                    <item>
                        <softId>2004</softId>
                        <softPackageId>VOLKSWAGEN</softPackageId>
                        <softPackageName>VOLKSWAGEN</softPackageName>
                        <version>V28.50</version>
                        <versionDetailId>500004</versionDetailId>
                        <fileSize>4048567</fileSize>
                        <url>${MY_SERVER_URL}/files/VW_V28.50.zip</url>
                    </item>
                    <item>
                        <softId>2005</softId>
                        <softPackageId>BENZ</softPackageId>
                        <softPackageName>MERCEDES-BENZ</softPackageName>
                        <version>V49.90</version>
                        <versionDetailId>500005</versionDetailId>
                        <fileSize>6048567</fileSize>
                        <url>${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
                    </item>
                    <item>
                        <softId>2006</softId>
                        <softPackageId>BMW</softPackageId>
                        <softPackageName>BMW / MINI</softPackageName>
                        <version>V50.00</version>
                        <versionDetailId>500006</versionDetailId>
                        <fileSize>5548567</fileSize>
                        <url>${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
                    </item>
                </diagSoftList>
            </return>
        </ns1:queryLatestDiagSoftsIncrCdnResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 4. مسار الروابط الأساسية (/urls - نفس الـ JSON الذي أرسلته)
// ----------------------------------------------------
app.all(['/urls', '/api/v2/urls'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "version": "74",
        "area": "2",
        "data": {
            "urls": [
                { "key": "login", "value": `${MY_SERVER_URL}/api/v2/login` },
                { "key": "check-token", "value": `${MY_SERVER_URL}/api/v2/check-token` },
                { "key": "productservice.*", "value": `${MY_SERVER_URL}/api/v2/product-service` },
                { "key": "publicsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice` },
                { "key": "publicsoftservice.nt", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt` },
                { "key": "x431padpublicsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice` },
                { "key": "x431paddiagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/diagsoftservice` },
                { "key": "diagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/diagsoftservice` },
                { "key": "publicsoft.download", "value": `${MY_SERVER_URL}/api/v2/download` },
                { "key": "downloaddiagsoftws.action", "value": `${MY_SERVER_URL}/api/v2/download` },
                { "key": "dlDiagSoftPack.action", "value": `${MY_SERVER_URL}/api/v2/download` }
            ]
        }
    });
});

// ----------------------------------------------------
// 5. مسار تسجيل الدخول (/api/v2/login)
// ----------------------------------------------------
app.all(['/login', '/api/v2/login'], (req, res) => {
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
// 6. Catch-All لأي مسارات أخرى
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
    console.log(`🚀 Master Diag Server Online on Port ${PORT}`);
});
