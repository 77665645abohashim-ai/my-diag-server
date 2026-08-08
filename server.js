const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;
const MY_DOMAIN = 'https://my-diag-server.onrender.com';

// إعدادات قراءة البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// 1. منع التخزين المؤقت (Cache)
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// 2. خريطة توجيه المسارات الكاملة
const fullRoutingResponse = {
    "code": 0,
    "msg": "success",
    "version": "74",
    "area": "2",
    "data": {
        "urls": [
            { "key": "login", "value": `${MY_DOMAIN}/api/v2/login` },
            { "key": "check-token", "value": `${MY_DOMAIN}/api/v2/check-token` },
            { "key": "productservice.*", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "publicsoftservice.*", "value": `${MY_DOMAIN}/api/v2/publicsoftservice` },
            { "key": "publicsoftservice.nt", "value": `${MY_DOMAIN}/api/v2/publicsoftservice-nt` },
            { "key": "x431padpublicsoftservice.*", "value": `${MY_DOMAIN}/api/v2/publicsoftservice` },
            { "key": "x431paddiagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "diagnosticLog.query", "value": `${MY_DOMAIN}/api/v2/diagnosticLog` },
            { "key": "createDiagSoftOrder", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "checkProductToUpgrade", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "publicsoft.download", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "downloaddiagsoftws.action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "diagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "activation", "value": `${MY_DOMAIN}/api/v2/activation` },
            { "key": "log.upload", "value": `${MY_DOMAIN}/api/v2/log-service-upload` },
            { "key": "report_list", "value": `${MY_DOMAIN}/api/v2/httapi-report-list` },
            { "key": "programfile.download_new", "value": `${MY_DOMAIN}/api/v2/download-programming` },
            { "key": "getVersionDetialIds", "value": `${MY_DOMAIN}/api/v2/getVersionDetialIds` },
            { "key": "td-check-locked", "value": `${MY_DOMAIN}/api/v2/td-check-locked` },
            { "key": "td-query-state", "value": `${MY_DOMAIN}/api/v2/td-query-state` },
            { "key": "url-upload", "value": `${MY_DOMAIN}/api/v2/url-upload` }
        ]
    }
};

app.all(['/api/v2/urls', '/api/v2/getRoutingInfo'], (req, res) => {
    res.json(fullRoutingResponse);
});

// 3. مسار تسجيل الدخول (يقرأ من responses/login.json إن وُجد)
app.all(['/api/v2/login', '/login.action', '/api/v2/user/login'], (req, res) => {
    const filePath = path.join(__dirname, 'responses', 'login.json');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.json({
            "code": 0,
            "msg": null,
            "data": {
                "xmpp": { "ip": "jabber.diagzone.com", "port": 5222, "domain": "diagzone.com" },
                "token": "YmxrVCtaaEVJNWUrWWhhcVY5VHIvdz09",
                "user": {
                    "user_id": "H21J4WOO",
                    "user_name": "979862374489",
                    "nick_name": "979862374489",
                    "email": "mistery4_ever@mail.ru",
                    "roles": "1",
                    "reg_zone": "1",
                    "country": "IT",
                    "nation_id": "237"
                }
            }
        });
    }
});

// 4. مسار خدمات المنتجات (يقرأ من responses/product-service.xml إن وُجد)
app.all('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const filePath = path.join(__dirname, 'responses', 'product-service.xml');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46><return><code>0</code><productDTOs><carLicenseTag></carLicenseTag><serialNo>979862374489</serialNo><dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
    }
});

// 5. مسار البرامج والماركات (يقرأ من responses/publicsoftservice.xml إن وُجد)
app.all(['/api/v2/publicsoftservice', '/api/v2/publicsoftservice-nt'], (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const filePath = path.join(__dirname, 'responses', 'publicsoftservice.xml');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts><return><code>0</code><message>success</message><x431PadSoftList><x431PadSoft><fileSize>393300</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>873</softId><softName>Firmware</softName><softPackageID>DOWNLOAD</softPackageID><softUpdateTime>2023-03-27 00:00:00</softUpdateTime><versionDetailId>343730</versionDetailId><versionNo>V11.91</versionNo></x431PadSoft></x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
    }
});

// 6. مسار رفع الروابط (url-upload)
app.all('/api/v2/url-upload', (req, res) => {
    const filePath = path.join(__dirname, 'responses', 'url-upload.json');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(200).json({ "code": 0, "msg": "success", "data": null });
    }
});

// 7. مسار خدمات التشخيص (diagsoftservice)
app.all('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const filePath = path.join(__dirname, 'responses', 'diagsoftservice.xml');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><ns1:queryDiagSofts xmlns:ns1="https://diagzone.com"><return><code>0</code><message>success</message></return></ns1:queryDiagSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
    }
});

// 8. مسار تحميل الملفات بذكاء بالاعتماد على softwares.json
app.all(['/api/v2/download', '/download', '/api/v2/publicsoft.download', '/api/v2/programfile.download_new'], (req, res) => {
    try {
        const softwaresPath = path.join(__dirname, 'responses', 'softwares.json');
        if (!fs.existsSync(softwaresPath)) {
            return res.status(404).json({ "code": 1, "msg": "softwares.json not found" });
        }
        
        const rawData = fs.readFileSync(softwaresPath, 'utf8');
        const data = JSON.parse(rawData);
        
        const versionDetailId = req.query.versionDetailId || req.body.versionDetailId;
        const softPackageID = req.query.softPackageID || req.body.softPackageID;
        
        let targetSoftware = null;
        
        if (versionDetailId) {
            targetSoftware = data.softwares.find(s => String(s.versionDetailId) === String(versionDetailId));
        } else if (softPackageID) {
            targetSoftware = data.softwares.find(s => s.softPackageID === softPackageID);
        }
        
        if (!targetSoftware && data.softwares.length > 0) {
            targetSoftware = data.softwares.find(s => s.softPackageID === "DOWNLOAD") || data.softwares[0];
        }
        
        if (targetSoftware && targetSoftware.fileName) {
            const filePath = path.join(__dirname, 'responses', targetSoftware.fileName);
            if (fs.existsSync(filePath)) {
                return res.download(filePath);
            } else {
                return res.status(404).send(`File ${targetSoftware.fileName} is missing in responses folder.`);
            }
        }
        
        res.status(404).json({ "code": 1, "msg": "Software not found in configuration" });
    } catch (error) {
        res.status(500).json({ "code": 1, "msg": "Server Error", "error": error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
