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

// مجلد الملفات العامة لتنزيل ملفات ZIP و APK
app.use('/files', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// طباعة الطلبات الواردة في الـ Console للتبع
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 2. مسار البرامج العامة المدمج مع الماركات (x431PadSoft)
// ----------------------------------------------------
app.all([
    '/api/v2/publicsoftservice-nt', 
    '/publicsoftservice-nt', 
    '/publicsoftservice',
    '/api/v2/publicsoftservice'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    console.log("✅ [PUBLICSOFT REQUEST]: Serving Firmware & Brands in x431PadSoft structure");

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryLatestPublicSoftsResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <x431PadSoftList>
                    <!-- التطبيقات والتحديثات الأساسية -->
                    <x431PadSoft>
                        <softId>1015</softId>
                        <softName>Diagzone PRO V2</softName>
                        <softPackageID>Diagzone_PRO_V2</softPackageID>
                        <versionNo>V2.00.033</versionNo>
                        <versionDetailId>359645</versionDetailId>
                        <fileSize>68365802</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2025-03-08 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/DiagPro_V2.apk</url>
                    </x431PadSoft>
                    <x431PadSoft>
                        <softId>873</softId>
                        <softName>Firmware</softName>
                        <softPackageID>DOWNLOAD</softPackageID>
                        <versionNo>V11.91</versionNo>
                        <versionDetailId>343730</versionDetailId>
                        <fileSize>393300</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2023-03-27 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/Firmware_V11.91.zip</url>
                    </x431PadSoft>

                    <!-- الماركات مضافة بنظام x431PadSoft -->
                    <x431PadSoft>
                        <softId>2001</softId>
                        <softName>DEMO Program</softName>
                        <softPackageID>DEMO</softPackageID>
                        <versionNo>V15.00</versionNo>
                        <versionDetailId>500001</versionDetailId>
                        <fileSize>1024567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
                    </x431PadSoft>
                    <x431PadSoft>
                        <softId>2002</softId>
                        <softName>EOBD2 Protocol</softName>
                        <softPackageID>EOBD2</softPackageID>
                        <versionNo>V22.80</versionNo>
                        <versionDetailId>500002</versionDetailId>
                        <fileSize>2048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
                    </x431PadSoft>
                    <x431PadSoft>
                        <softId>2003</softId>
                        <softName>TOYOTA / LEXUS</softName>
                        <softPackageID>TOYOTA</softPackageID>
                        <versionNo>V50.10</versionNo>
                        <versionDetailId>500003</versionDetailId>
                        <fileSize>5048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                    </x431PadSoft>
                    <x431PadSoft>
                        <softId>2004</softId>
                        <softName>VW / AUDI</softName>
                        <softPackageID>VOLKSWAGEN</softPackageID>
                        <versionNo>V28.50</versionNo>
                        <versionDetailId>500004</versionDetailId>
                        <fileSize>4048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/VW_V28.50.zip</url>
                    </x431PadSoft>
                    <x431PadSoft>
                        <softId>2005</softId>
                        <softName>MERCEDES-BENZ</softName>
                        <softPackageID>BENZ</softPackageID>
                        <versionNo>V49.90</versionNo>
                        <versionDetailId>500005</versionDetailId>
                        <fileSize>6048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
                    </x431PadSoft>
                    <x431PadSoft>
                        <softId>2006</softId>
                        <softName>BMW / MINI</softName>
                        <softPackageID>BMW</softPackageID>
                        <versionNo>V50.00</versionNo>
                        <versionDetailId>500006</versionDetailId>
                        <fileSize>5548567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <url>${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
                    </x431PadSoft>
                </x431PadSoftList>
            </return>
        </ns1:queryLatestPublicSoftsResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(xmlResponse);
});

// ----------------------------------------------------
// 3. مسار الروابط الأساسية (/urls)
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
// 4. مسار تسجيل الدخول (/login)
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
// 5. Catch-All لأي مسارات إضافية
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
