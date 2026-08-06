const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));

app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.use('/api/v2/download', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// المسار المسؤول عن استقبال queryLatestPublicSofts والرد عليها بالهيكلية الصحيحة
app.all([
    '/api/v2/publicsoftservice-nt', 
    '/publicsoftservice-nt', 
    '/publicsoftservice',
    '/api/v2/publicsoftservice',
    '/api/v2/diagsoftservice',
    '/diagsoftservice',
    '/api/v2/x431paddiagsoftservice',
    '/x431paddiagsoftservice'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    console.log("✅ [PUBLICSOFT]: Responding to queryLatestPublicSofts with all packages");

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryLatestPublicSoftsResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <x431PadSoftList>
                    <!-- 1. Diagzone PRO V2 -->
                    <x431PadSoft>
                        <fileSize>68365802</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>1015</softId>
                        <softName>Diagzone PRO V2</softName>
                        <softPackageID>Diagzone_PRO_V2</softPackageID>
                        <softUpdateTime>2025-03-08 00:00:00</softUpdateTime>
                        <versionDetailId>359645</versionDetailId>
                        <versionNo>V2.00.033</versionNo>
                        <url>${MY_SERVER_URL}/files/DiagPro_V2.apk</url>
                    </x431PadSoft>

                    <!-- 2. Firmware -->
                    <x431PadSoft>
                        <fileSize>393300</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>873</softId>
                        <softName>Firmware</softName>
                        <softPackageID>DOWNLOAD</softPackageID>
                        <softUpdateTime>2023-03-27 00:00:00</softUpdateTime>
                        <versionDetailId>343730</versionDetailId>
                        <versionNo>V11.91</versionNo>
                        <url>${MY_SERVER_URL}/files/Firmware_V11.91.zip</url>
                    </x431PadSoft>

                    <!-- 3. VIN Recognition App -->
                    <x431PadSoft>
                        <fileSize>6166636</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>880</softId>
                        <softName>VIN Recognition App</softName>
                        <softPackageID>VIN_RECOGNITION_APP</softPackageID>
                        <softUpdateTime>2024-05-02 00:00:00</softUpdateTime>
                        <versionDetailId>354418</versionDetailId>
                        <versionNo>V1.01.006</versionNo>
                        <url>${MY_SERVER_URL}/files/VIN_App.zip</url>
                    </x431PadSoft>

                    <!-- 4. DEMO -->
                    <x431PadSoft>
                        <fileSize>1024567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>2001</softId>
                        <softName>DEMO</softName>
                        <softPackageID>DEMO</softPackageID>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <versionDetailId>500001</versionDetailId>
                        <versionNo>V15.00</versionNo>
                        <url>${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
                    </x431PadSoft>

                    <!-- 5. EOBD2 -->
                    <x431PadSoft>
                        <fileSize>2048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>2002</softId>
                        <softName>EOBD2 Protocol</softName>
                        <softPackageID>EOBD2</softPackageID>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <versionDetailId>500002</versionDetailId>
                        <versionNo>V22.80</versionNo>
                        <url>${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
                    </x431PadSoft>

                    <!-- 6. TOYOTA -->
                    <x431PadSoft>
                        <fileSize>5048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>2003</softId>
                        <softName>TOYOTA / LEXUS</softName>
                        <softPackageID>TOYOTA</softPackageID>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <versionDetailId>500003</versionDetailId>
                        <versionNo>V50.10</versionNo>
                        <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                    </x431PadSoft>

                    <!-- 7. VOLKSWAGEN -->
                    <x431PadSoft>
                        <fileSize>4048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>2004</softId>
                        <softName>VOLKSWAGEN</softName>
                        <softPackageID>VOLKSWAGEN</softPackageID>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <versionDetailId>500004</versionDetailId>
                        <versionNo>V28.50</versionNo>
                        <url>${MY_SERVER_URL}/files/VW_V28.50.zip</url>
                    </x431PadSoft>

                    <!-- 8. MERCEDES-BENZ -->
                    <x431PadSoft>
                        <fileSize>6048567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>2005</softId>
                        <softName>MERCEDES-BENZ</softName>
                        <softPackageID>BENZ</softPackageID>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <versionDetailId>500005</versionDetailId>
                        <versionNo>V49.90</versionNo>
                        <url>${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
                    </x431PadSoft>

                    <!-- 9. BMW -->
                    <x431PadSoft>
                        <fileSize>5548567</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-06</serverCurrentTime>
                        <softId>2006</softId>
                        <softName>BMW / MINI</softName>
                        <softPackageID>BMW</softPackageID>
                        <softUpdateTime>2026-01-01 00:00:00</softUpdateTime>
                        <versionDetailId>500006</versionDetailId>
                        <versionNo>V50.00</versionNo>
                        <url>${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
                    </x431PadSoft>
                </x431PadSoftList>
            </return>
        </ns1:queryLatestPublicSoftsResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(xmlResponse);
});

// مسار خريطة الروابط (/urls)
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
                { "key": "x431paddiagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice` },
                { "key": "diagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice` },
                { "key": "publicsoft.download", "value": `${MY_SERVER_URL}/api/v2/download` },
                { "key": "downloaddiagsoftws.action", "value": `${MY_SERVER_URL}/api/v2/download` }
            ]
        }
    });
});

// مسار تسجيل الدخول (/login)
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

app.all('*', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": { "status": "ACTIVE" }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Final Diag Server Online on Port ${PORT}`);
});
