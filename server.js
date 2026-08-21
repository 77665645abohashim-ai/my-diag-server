const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;
const MY_DOMAIN = 'https://my-diag-server.onrender.com';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// منع التخزين المؤقت
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// 1. خريطة الروابط (URLs Map)
const fullRoutingResponse = {
    "code": 0,
    "msg": "success",
    "version": "74",
    "area": "2",
    "data": {
        "urls": [
            { "key": "login", "value": "https://diagboss.ch/api/v2/login" },
            { "key": "check-token", "value": `${MY_DOMAIN}/api/v2/check-token` },
            { "key": "downdsfrag", "value": `${MY_DOMAIN}/api/v2/url-upload` },
            { "key": "pointdownsys", "value": `${MY_DOMAIN}/api/v2/url-upload` },
            { "key": "getShopRemindStatus", "value": `${MY_DOMAIN}/api/v2/url-upload` },
            { "key": "publicsoft.download", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "url-upload", "value": `${MY_DOMAIN}/api/v2/url-upload` }
        ]
    }
};

app.all(['/', '/api/v2/config', '/api/v2/urls'], (req, res) => res.json(fullRoutingResponse));

// 2. معالجة تقارير الأخطاء والطلبات الديناميكية
app.all('/api/v2/url-upload', (req, res) => {
    console.log("--> Request received for url-upload / dynamic key:", req.body.url || req.query.url);
    res.json({
        "code": 0,
        "msg": "success"
    });
});

// 3. مسار التحميل الفعلي
app.all('/api/v2/download', (req, res) => {
    const downloadUrl = 'https://drive.google.com/uc?export=download&id=1-WxtYve6Ja5oR4I5hFPSSGc8gx_HHYHY';
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "downloadUrl": downloadUrl,
            "url": downloadUrl,
            "fileSize": 35000000
        }
    });
});

// 4. تسجيل الدخول
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

// 5. خدمات SOAP (تم فصل product-service عن البقية بالاستجابة الأصلية الدقيقة)
app.all('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46><return><code>0</code><productDTOs><carLicenseTag></carLicenseTag><serialNo>979862374489</serialNo><dzKey>WpFNRUnQThVAz/lNTGrq3nhN5bmcNSo7Ntdj4fv5pfWUEWWWi2V+xYALPP7K4obNxNLJhoRbCHaObSQJV2s86E+yE6xsvZJL5Z6fYPjbfb6bWI1hL3FkA3qhH50vBAMo7BAslnf7aT1hcVbJRIqWbnIhhLILmZ+h5naRReqc3ZyXP/T0Mx3TJTksXkIE2P9x</dzKey><pdtCategory>2</pdtCategory></productDTOs><productDTOs><carLicenseTag></carLicenseTag><serialNo>989140722496</serialNo><dzKey>NgfpI+Mvntqj2KiEZmVEIH7XofYtj7mqUm7QIcum+iRS7DGNlIfioKgGo5KaPjQipeMoccwg/n6orcrV0Bd+GaKbjfi/m7x3yKniRVhtl3iVmxUmbKpl9J/3K3pDRvNy4M0rlPu/O1too9z+NRqXy2TwBTlXIVgvzRxiNnGChzqEtWnbpG/JDB2S8vkW4d10</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});

app.all(['/api/v2/publicsoftservice', '/api/v2/diagsoftservice'], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts xmlns:ns1="https://diagzone.com"><return><code>0</code><x431PadSoftList>
        <x431PadSoft><softId>1015</softId><softName>Diagzone PRO V2</softName><softPackageID>Diagzone_PRO_V2</softPackageID><versionDetailId>359645</versionDetailId><versionNo>V2.00.033</versionNo></x431PadSoft>
    </x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
