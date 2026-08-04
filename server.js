const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// Middleware لمعالجة النصوص ونوع المحتوى
app.use((req, res, next) => {
    let bodyStr = "";
    if (typeof req.body === 'string') {
        bodyStr = req.body;
    } else if (Buffer.isBuffer(req.body)) {
        bodyStr = req.body.toString();
    } else {
        bodyStr = JSON.stringify(req.body || {});
    }
    req.rawBodyStr = bodyStr;
    next();
});

// ==========================================
// 1. مسار الفحص والتنشيط (/api/v2/check)
// ==========================================
app.post('/api/v2/check', (req, res) => {
    const encryptedPayload = "AgAAAAAACAAEAAAAEAAGAAMAcQAAAARsWT1D357sEZgy9KR/cczvOBURWFP+bBGYMvSkf3HM7zgVEVhT";

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');

    return res.status(200).json({
        code: 0,
        message: "OK",
        data: encryptedPayload
    });
});

// ==========================================
// 2. مسارات التشخيص والـ Handshake المشفرة
// ==========================================
app.post(['/api/v2/diagnostic', '/api/v2/handshake'], (req, res) => {
    const encryptedPayload = "AgAAAAAACAAEAAAAEAAGAAMAcQAAAARsWT1D357sEZgy9KR/cczvOBURWFP+bBGYMvSkf3HM7zgVEVhT";

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    return res.status(200).json({
        code: 0,
        message: "OK",
        data: encryptedPayload
    });
});

// ==========================================
// 3. مسار تسجيل الدخول والطلبات المرافقة (/api/v2/login)
// ==========================================
app.post('/api/v2/login', (req, res) => {
    const reqBodyStr = req.rawBodyStr;
    const serialNoParam = req.body.serialNo || "979862374489";

    // أ) إذا كان الطلب استعلام XML / SOAP عن المنتجات والتراخيص
    if (reqBodyStr.includes('getRegisteredProductsForPad46')) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
    <SOAP-ENV:Body>
        <ns1:getRegisteredProductsForPad46>
            <return>
                <code>0</code>
                <productDTOs>
                    <carLicenseTag></carLicenseTag>
                    <serialNo>${serialNoParam}</serialNo>
                    <dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey>
                    <pdtCategory>2</pdtCategory>
                </productDTOs>
            </return>
        </ns1:getRegisteredProductsForPad46>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
        return res.status(200).send(soapXmlResponse);
    }

    // ب) إذا كان الطلب استعلام SOAP عن تحديثات البرمجيات
    if (reqBodyStr.includes('queryLatestPublicSofts')) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
    <SOAP-ENV:Body>
        <ns1:queryLatestPublicSofts>
            <return>
                <code>0</code>
                <message>success</message>
                <x431PadSoftList>
                    <x431PadSoft>
                        <fileSize>68365802</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-04</serverCurrentTime>
                        <softId>1015</softId>
                        <softName>Diagzone PRO V2</softName>
                        <softPackageID>Diagzone_PRO_V2</softPackageID>
                        <softUpdateTime>2025-03-08 00:00:00</softUpdateTime>
                        <versionDetailId>359645</versionDetailId>
                        <versionNo>V2.00.033</versionNo>
                    </x431PadSoft>
                    <x431PadSoft>
                        <fileSize>393300</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-04</serverCurrentTime>
                        <softId>873</softId>
                        <softName>Firmware</softName>
                        <softPackageID>DOWNLOAD</softPackageID>
                        <softUpdateTime>2023-03-27 00:00:00</softUpdateTime>
                        <versionDetailId>343730</versionDetailId>
                        <versionNo>V11.91</versionNo>
                    </x431PadSoft>
                    <x431PadSoft>
                        <fileSize>15200100</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-04</serverCurrentTime>
                        <softId>1001</softId>
                        <softName>DEMO</softName>
                        <softPackageID>DEMO</softPackageID>
                        <softUpdateTime>2025-05-01 00:00:00</softUpdateTime>
                        <versionDetailId>350001</versionDetailId>
                        <versionNo>V10.66</versionNo>
                    </x431PadSoft>
                </x431PadSoftList>
            </return>
        </ns1:queryLatestPublicSofts>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
        return res.status(200).send(soapXmlResponse);
    }

    // ج) إذا كان الطلب يتضمن فحص الجلسة المباشر كـ Encrypted Payload داخل login
    if (reqBodyStr.includes('action=check') || reqBodyStr.includes('verify')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(200).json({
            code: 0,
            message: "OK",
            data: "AgAAAAAACAAEAAAAEAAGAAMAcQAAAARsWT1D357sEZgy9KR/cczvOBURWFP+bBGYMvSkf3HM7zgVEVhT"
        });
    }

    // د) الرد المباشر ببيانات الحساب والـ Token
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
        code: 0,
        msg: null,
        data: {
            xmpp: {
                ip: "jabber.diagzone.com",
                port: 5222,
                domain: "diagzone.com"
            },
            token: req.body.token || "TzUxQ1FtejQvYmNqZEt4OGRsMUlxZz09",
            user: {
                user_id: "H21J4WOO",
                sex: "1",
                user_name: serialNoParam,
                nick_name: serialNoParam,
                mobile: "",
                is_bind_mobile: "0",
                email: "mistery4_ever@mail.ru",
                is_bind_email: "0",
                signature: "",
                set_face_time: "0",
                roles: "1",
                reg_zone: "1",
                reg_source: "0",
                is_agree_clause: "0",
                pub_id: "",
                face_url: null,
                is_365: false,
                tech_status: "-1",
                country: "IT",
                province: null,
                city: null,
                nation_id: "237"
            },
            config: null
        }
    });
});

// ==========================================
// 4. بقية مسارات الخدمات
// ==========================================
app.post('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><return><code>0</code></return></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});

app.post(['/api/v2/statistics', '/api/v2/url-upload'], (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ code: 0, msg: null, data: { user_id: 0, bool: "0", status: "1" } });
});

app.get('/', (req, res) => {
    res.send("DiagZone Server is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
