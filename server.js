const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;
const MY_DOMAIN = 'https://my-diag-server.onrender.com';

// إعدادات قراءة البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// 1. منع التخزين المؤقت
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// 2. خريطة التوجيه
const fullRoutingResponse = {
    "code": 0,
    "msg": "success",
    "version": "74",
    "area": "2",
    "data": {
        "urls": [
            { "key": "login", "value": "https://diagboss.ch/api/v2/login" },
            { "key": "check-token", "value": `${MY_DOMAIN}/api/v2/check-token` },
            { "key": "productservice.*", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "publicsoftservice.*", "value": `${MY_DOMAIN}/api/v2/publicsoftservice` },
            { "key": "x431paddiagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "diagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "publicsoft.download", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "downloaddiagsoftws.action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "dlDiagSoftPack.action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "downdsfrag", "value": `${MY_DOMAIN}/api/v2/url-upload` },
            { "key": "pointdownsys", "value": `${MY_DOMAIN}/api/v2/url-upload` },
            { "key": "activation", "value": "https://diagboss.ch/api/v2/activation" },
            { "key": "log.upload", "value": "https://diagboss.ch/api/v2/log-service-upload" },
            { "key": "getVersionDetialIds", "value": `${MY_DOMAIN}/api/v2/getVersionDetialIds` },
            { "key": "url-upload", "value": `${MY_DOMAIN}/api/v2/url-upload` }
        ]
    }
};

// 3. المسارات الأساسية
app.all(['/', '/api/v2/config', '/api/v2/urls'], (req, res) => res.json(fullRoutingResponse));

app.all(['/api/v2/login', '/login.action'], (req, res) => {
    res.json({
        "code": 0,
        "data": {
            "token": "MGtjNDgzMGJUhLMVN4VitXb29qQT09",
            "user": { "user_id": "H21J4WOO", "user_name": "979862374489" }
        }
    });
});

app.all('/api/v2/check-token', (req, res) => res.json({ "code": 0, "msg": "success", "data": { "isValid": true } }));

app.all('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46 xmlns:ns1="https://diagzone.com"><return><code>0</code><productDTOs><serialNo>979862374489</serialNo><dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});

app.all(['/api/v2/publicsoftservice', '/api/v2/diagsoftservice'], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts xmlns:ns1="https://diagzone.com"><return><code>0</code><x431PadSoftList>
        <x431PadSoft><softId>1015</softId><softName>Diagzone PRO V2</softName><softPackageID>Diagzone_PRO_V2</softPackageID><versionDetailId>359645</versionDetailId><versionNo>V2.00.033</versionNo></x431PadSoft>
    </x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});

// 4. المسار المحدث url-upload (لحل مشكلة التكرار)
app.all('/api/v2/url-upload', (req, res) => {
    const downloadUrl = 'https://drive.google.com/uc?export=download&id=1-WxtYve6Ja5oR4I5hFPSSGc8gx_HHYHY';
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "downloadUrl": downloadUrl,
            "url": downloadUrl,
            "path": downloadUrl,
            "fileUrl": downloadUrl,
            "fileSize": 35000000
        }
    });
});

app.all('/api/v2/download', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": { "downloadUrl": 'https://drive.google.com/uc?export=download&id=1-WxtYve6Ja5oR4I5hFPSSGc8gx_HHYHY', "fileSize": 35000000 }
    });
});

app.all('/api/v2/getVersionDetialIds', (req, res) => res.json({ "code": 0, "msg": "success", "data": [] }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
