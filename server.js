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

// طباعة الطلبات الواردة للمتابعة
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
// 3. مسار الماركات المشتركة (queryPDTDiagSoftSubPack)
// ----------------------------------------------------
app.all([
    '/api/v2/diagsoftservice',
    '/diagsoftservice',
    '/api/v2/x431paddiagsoftservice',
    '/x431paddiagsoftservice'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    console.log("✅ [DIAGSOFT]: Responding with correct SOAP Envelope for queryPDTDiagSoftSubPack");

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryPDTDiagSoftSubPackResponse SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <return xsi:type="ns1:ResponseModel">
                <code xsi:type="xsd:int">0</code>
                <message xsi:type="xsd:string">success</message>
                <diagSoftList href="#id1"/>
            </return>
        </ns1:queryPDTDiagSoftSubPackResponse>
        <SOAP-ENC:Array id="id1" xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="ns1:DiagSoft[6]">
            <item href="#id2"/>
            <item href="#id3"/>
            <item href="#id4"/>
            <item href="#id5"/>
            <item href="#id6"/>
            <item href="#id7"/>
        </SOAP-ENC:Array>
        <ns1:DiagSoft id="id2" xsi:type="ns1:DiagSoft">
            <softId xsi:type="xsd:int">2001</softId>
            <softPackageId xsi:type="xsd:string">DEMO</softPackageId>
            <softPackageName xsi:type="xsd:string">DEMO</softPackageName>
            <version xsi:type="xsd:string">V15.00</version>
            <versionDetailId xsi:type="xsd:int">500001</versionDetailId>
            <fileSize xsi:type="xsd:long">1024567</fileSize>
            <url xsi:type="xsd:string">${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
        </ns1:DiagSoft>
        <ns1:DiagSoft id="id3" xsi:type="ns1:DiagSoft">
            <softId xsi:type="xsd:int">2002</softId>
            <softPackageId xsi:type="xsd:string">EOBD2</softPackageId>
            <softPackageName xsi:type="xsd:string">EOBD2 Protocol</softPackageName>
            <version xsi:type="xsd:string">V22.80</version>
            <versionDetailId xsi:type="xsd:int">500002</versionDetailId>
            <fileSize xsi:type="xsd:long">2048567</fileSize>
            <url xsi:type="xsd:string">${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
        </ns1:DiagSoft>
        <ns1:DiagSoft id="id4" xsi:type="ns1:DiagSoft">
            <softId xsi:type="xsd:int">2003</softId>
            <softPackageId xsi:type="xsd:string">TOYOTA</softPackageId>
            <softPackageName xsi:type="xsd:string">TOYOTA / LEXUS</softPackageName>
            <version xsi:type="xsd:string">V50.10</version>
            <versionDetailId xsi:type="xsd:int">500003</versionDetailId>
            <fileSize xsi:type="xsd:long">5048567</fileSize>
            <url xsi:type="xsd:string">${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
        </ns1:DiagSoft>
        <ns1:DiagSoft id="id5" xsi:type="ns1:DiagSoft">
            <softId xsi:type="xsd:int">2004</softId>
            <softPackageId xsi:type="xsd:string">VOLKSWAGEN</softPackageId>
            <softPackageName xsi:type="xsd:string">VOLKSWAGEN</softPackageName>
            <version xsi:type="xsd:string">V28.50</version>
            <versionDetailId xsi:type="xsd:int">500004</versionDetailId>
            <fileSize xsi:type="xsd:long">4048567</fileSize>
            <url xsi:type="xsd:string">${MY_SERVER_URL}/files/VW_V28.50.zip</url>
        </ns1:DiagSoft>
        <ns1:DiagSoft id="id6" xsi:type="ns1:DiagSoft">
            <softId xsi:type="xsd:int">2005</softId>
            <softPackageId xsi:type="xsd:string">BENZ</softPackageId>
            <softPackageName xsi:type="xsd:string">MERCEDES-BENZ</softPackageName>
            <version xsi:type="xsd:string">V49.90</version>
            <versionDetailId xsi:type="xsd:int">500005</versionDetailId>
            <fileSize xsi:type="xsd:long">6048567</fileSize>
            <url xsi:type="xsd:string">${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
        </ns1:DiagSoft>
        <ns1:DiagSoft id="id7" xsi:type="ns1:DiagSoft">
            <softId xsi:type="xsd:int">2006</softId>
            <softPackageId xsi:type="xsd:string">BMW</softPackageId>
            <softPackageName xsi:type="xsd:string">BMW / MINI</softPackageName>
            <version xsi:type="xsd:string">V50.00</version>
            <versionDetailId xsi:type="xsd:int">500006</versionDetailId>
            <fileSize xsi:type="xsd:long">5548567</fileSize>
            <url xsi:type="xsd:string">${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
        </ns1:DiagSoft>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(xmlResponse);
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
                { "key": "login", "value": `${MY_SERVER_URL}/api/v2/login` },
                { "key": "check-token", "value": `${MY_SERVER_URL}/api/v2/check-token` },
                { "key": "productservice.*", "value": `${MY_SERVER_URL}/api/v2/product-service` },
                { "key": "publicsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice` },
                { "key": "publicsoftservice.nt", "value": `${MY_SERVER_URL}/api/v2/publicsoftservice-nt` },
                { "key": "x431paddiagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/diagsoftservice` },
                { "key": "diagsoftservice.*", "value": `${MY_SERVER_URL}/api/v2/diagsoftservice` },
                { "key": "publicsoft.download", "value": `${MY_SERVER_URL}/api/v2/download` },
                { "key": "downloaddiagsoftws.action", "value": `${MY_SERVER_URL}/api/v2/download` }
            ]
        }
    });
});

// ----------------------------------------------------
// 5. تسجيل الدخول (/login)
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
    console.log(`🚀 Complete Diag Server Online on Port ${PORT}`);
});
