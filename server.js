const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;
const MY_DOMAIN = 'https://my-diag-server.onrender.com';

// إعدادات قراءة البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// 1. منع التخزين المؤقت (Cache) لضمان جلب التحديثات فوراً
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
            { "key": "login", "value": "https://diagboss.ch/api/v2/login" },
            { "key": "check-token", "value": "https://my-diag-server.onrender.com/api/v2/check-token" },
            { "key": "productservice.*", "value": "https://my-diag-server.onrender.com/api/v2/product-service" },
            { "key": "publicsoftservice.*", "value": "https://my-diag-server.onrender.com/api/v2/publicsoftservice" },
            { "key": "publicsoftservice.nt", "value": "https://my-diag-server.onrender.com/api/v2/publicsoftservice-nt" },
            { "key": "x431padpublicsoftservice.*", "value": "https://my-diag-server.onrender.com/api/v2/publicsoftservice" },
            { "key": "x431paddiagsoftservice.*", "value": "https://my-diag-server.onrender.com/api/v2/diagsoftservice" },
            { "key": "diagnosticLog.query", "value": "https://my-diag-server.onrender.com/api/v2/diagnosticLog" },
            { "key": "createDiagSoftOrder", "value":"https://my-diag-server.onrender.com/api/v2/product-service" },
            { "key": "checkProductToUpgrade", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "publicsoft.download", "value":"https://my-diag-server.onrender.com/api/v2/download" },
            { "key": "doinloaddiagsoftws.action", "value":"https://my-diag-server.onrender.com/api/v2/download" },
            { "key": "diagsoftservice.*", "value": "https://my-diag-server.onrender.com/api/v2/diagsoftservice" },
            { "key": "activation", "value": "https://diagboss.ch/api/v2/activation" },
            { "key": "log.upload", "value": "https://diagboss.ch/api/v2/log-service-upload" },
            { "key": "report_list", "value": `${MY_DOMAIN}/api/v2/httapi-report-list` },
            { "key": "programfile.download_new", "value":"https://my-diag-server.onrender.com/api/v2/download-programming" },
            { "key": "td.query-state", "value": "https://diagboss.ch/api/v2/td-query-state" },
            { "key": "td.check-locked", "value": "https://diagboss.ch/api/v2/td-check-locked" },
            { "key": "getVersionDetialIds", "value": "https://diagboss.ch/api/v2/getVersionDetialIds" }
        ]
    }
};

// 3. مسار تسجيل الدخول
app.all(['/api/v2/login', '/login.action', '/api/v2/user/login'], (req, res) => {
    console.log('[API] Login Request Received');
    res.json({
        "code": 0,
        "msg": null,
        "data": {
            "xmpp": { "ip": "jabber.diagzone.com", "port": 5222, "domain": "diagzone.com" },
            "token": "MGtjNDgzMGJUhLMVN4VitXb29qQT09",
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
});

// 4. معالجة طلب الاستعلام عن الحالة
app.all('/api/v2/td-query-state', (req, res) => {
    res.json({ "code": 0, "message": "OK" });
});

// 5. معالجة طلب التحقق من القفل
app.all('/api/v2/td-check-locked', (req, res) => {
    res.json({ "code": 0, "message": "OK", "data": { "isLocked": false } });
});

// 6. مسار خدمات المنتجات
app.all('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46><return><code>0</code><productDTOs><carLicenseTag></carLicenseTag><serialNo>979862374489</serialNo><dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 7. مسار خدمات البرامج والماركات الشامل
app.all(['/api/v2/publicsoftservice', '/api/v2/publicsoftservice-nt'], (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts><return><code>0</code><message>success</message><x431PadSoftList><x431PadSoft><fileSize>393300</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>873</softId><softName>Firmware</softName><softPackageID>DOWNLOAD</softPackageID><softUpdateTime>2023-03-27 00:00:00</softUpdateTime><versionDetailId>343730</versionDetailId><versionNo>V11.91</versionNo></x431PadSoft></x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 8. مسار خدمات التشخيص الشامل
app.all('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryLatestDiagSoftsIncrCdn><return><code>0</code><message>success</message><x431PadSoftIncrList><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>55740637</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-15</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>69</softId><softName>Demo</softName><softPackageID>DEMO</softPackageID><softUpdateTime>2026-03-04 10:32:08</softUpdateTime><versionDetailId>380901</versionDetailId><versionNo>V15.68</versionNo></x431PadSoftIncr></x431PadSoftIncrList></return></ns1:queryLatestDiagSoftsIncrCdn></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 9. الروابط العامة والتفعيل
app.all(['/', '/api/v2/config', '/api/v2/urls'], (req, res) => {
    res.json(fullRoutingResponse);
});

app.all('/api/v2/activation', (req, res) => {
    res.json({ "code": 0, "msg": "OK", "data": { "activationCode": "bytPLzY0VWRXT1NLbjVRZ0FzOEFSdz09" } });
});

// 10. مسار التحميل (302 Redirect) المتوافق مع التطبيق
app.all('/api/v2/download', (req, res) => {
    console.log('[Download Request Query]:', req.query);
    const githubFileUrl = 'https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1.0/DEMO.zip';
    res.redirect(302, githubFileUrl);
});

// 11. مسار احتياطي لـ url-upload في حال طلبها التطبيق
app.all('/api/v2/url-upload', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "url": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1.0/DEMO.zip"
        }
    });
});

app.all('*', (req, res) => {
    res.json({ "code": 0, "msg": "success", "data": {} });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
