const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// تحديد نوع الرد تلقائياً بناءً على محتوى الطلب
app.use((req, res, next) => {
    let bodyStr = "";
    if (typeof req.body === 'string') {
        bodyStr = req.body;
    } else if (Buffer.isBuffer(req.body)) {
        bodyStr = req.body.toString();
    } else {
        bodyStr = JSON.stringify(req.body || {});
    }

    if (bodyStr.includes('Envelope') || bodyStr.includes('soap')) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    } else {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
});

// 1. مسار تسجيل الدخول الرئيسي (يقوم بالرد بناءً على محتوى طلب الـ SOAP أو الـ JSON)
app.post('/api/v2/login', (req, res) => {
    let reqBodyStr = typeof req.body === 'string' ? req.body : Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body || {});

    // إذا طلب التطبيق المنتجات والتراخيص
    if (reqBodyStr.includes('getRegisteredProductsForPad46')) {
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:getRegisteredProductsForPad46>
            <return>
                <code>0</code>
                <productDTOs>
                    <carLicenseTag></carLicenseTag>
                    <serialNo>979862374489</serialNo>
                    <dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey>
                    <pdtCategory>2</pdtCategory>
                </productDTOs>
            </return>
        </ns1:getRegisteredProductsForPad46>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
        return res.status(200).send(soapXmlResponse);
    }

    // إذا طلب التطبيق إصدار الـ CDN
    if (reqBodyStr.includes('getMaxVersionForMobileAppCDN')) {
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:getMaxVersionForMobileAppCDNResponse xmlns:ns1="https://diagzone.com">
            <getMaxVersionForMobileAppCDNReturn>
                <version>2.00.027</version>
                <url>https://my-diag-server.onrender.com/download/dummy.zip</url>
                <md5>d41d8cd98f00b204e9800998ecf8427e</md5>
                <updateContent>Latest stable version</updateContent>
            </getMaxVersionForMobileAppCDNReturn>
        </ns1:getMaxVersionForMobileAppCDNResponse>
    </soap:Body>
</soap:Envelope>`;
        return res.status(200).send(soapXmlResponse);
    }

    // الاستجابة الأصلية الكاملة لتسجيل الدخول
    return res.status(200).json({
        code: 0,
        msg: null,
        data: {
            xmpp: {
                ip: "jabber.diagzone.com",
                port: 5222,
                domain: "diagzone.com"
            },
            token: "TzUxQ1FtejQvYmNqZEt4OGRsMUlxZz09",
            user: {
                user_id: "H21J4WOO",
                sex: "1",
                user_name: "979862374489",
                nick_name: "979862374489",
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

// 2. مسار الخدمات والمنتجات (Product Service)
app.post('/api/v2/product-service', (req, res) => {
    const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:getRegisteredProductsForPad46>
            <return>
                <code>0</code>
                <productDTOs>
                    <carLicenseTag></carLicenseTag>
                    <serialNo>979862374489</serialNo>
                    <dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey>
                    <pdtCategory>2</pdtCategory>
                </productDTOs>
            </return>
        </ns1:getRegisteredProductsForPad46>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(soapXmlResponse);
});

// 3. مسار البرمجيات العامة (Public Soft Service)
app.post('/api/v2/publicsoftservice', (req, res) => {
    const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:queryLatestPublicSoftsResponse xmlns:ns1="https://diagzone.com">
            <queryLatestPublicSoftsReturn>
                <item>
                    <softCode>DEMO</softCode>
                    <softName>DEMO V15.86</softName>
                    <version>15.86</version>
                    <type>PRO</type>
                </item>
            </queryLatestPublicSoftsReturn>
        </ns1:queryLatestPublicSoftsResponse>
    </soap:Body>
</soap:Envelope>`;
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(soapXmlResponse);
});

// 4. مسار سجلات الفحص (Diagnostic Log)
app.post('/api/v2/diagnosticLog', (req, res) => {
    const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:queryDiagnosticLogBasicResponse xmlns:ns1="https://diagzone.com">
            <queryDiagnosticLogBasicReturn>
                <code>0</code>
                <msg>success</msg>
            </queryDiagnosticLogBasicReturn>
        </ns1:queryDiagnosticLogBasicResponse>
    </soap:Body>
</soap:Envelope>`;
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(soapXmlResponse);
});

// 5. مسار الإحصائيات وتقارير الأخطاء (Statistics & URL Upload)
app.post(['/api/v2/statistics', '/api/v2/url-upload'], (req, res) => {
    return res.status(200).json({
        code: 0,
        msg: null,
        data: {
            user_id: 0,
            bool: "0",
            status: "1"
        }
    });
});

app.get('/', (req, res) => {
    res.send("DiagZone Server is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
