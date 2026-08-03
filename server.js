const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// تحديد نوع الرد تلقائياً بناءً على محتوى الطلب (XML أو JSON)
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

// 1. مسار تسجيل الدخول والطلبات المرتبطة به
app.post('/api/v2/login', (req, res) => {
    let reqBodyStr = typeof req.body === 'string' ? req.body : Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body || {});

    // إذا طلب التطبيق المنتجات والتراخيص المسجلة
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

    // إذا طلب التطبيق الاستعلام عن البرمجيات العامة لجدول التحديثات (queryLatestPublicSofts)
    if (reqBodyStr.includes('queryLatestPublicSofts')) {
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryLatestPublicSofts>
            <return>
                <code>0</code>
                <message>success</message>
                <x431PadSoftList>
                    <x431PadSoft>
                        <fileSize>68365802</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-03</serverCurrentTime>
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
                        <serverCurrentTime>2026-08-03</serverCurrentTime>
                        <softId>873</softId>
                        <softName>Firmware</softName>
                        <softPackageID>DOWNLOAD</softPackageID>
                        <softUpdateTime>2023-03-27 00:00:00</softUpdateTime>
                        <versionDetailId>343730</versionDetailId>
                        <versionNo>V11.91</versionNo>
                    </x431PadSoft>
                    <x431PadSoft>
                        <fileSize>6166636</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-03</serverCurrentTime>
                        <softId>880</softId>
                        <softName>VIN Recognition App</softName>
                        <softPackageID>VIN_RECOGNITION_APP</softPackageID>
                        <softUpdateTime>2024-05-02 00:00:00</softUpdateTime>
                        <versionDetailId>354418</versionDetailId>
                        <versionNo>V1.01.006</versionNo>
                    </x431PadSoft>
                    <x431PadSoft>
                        <fileSize>15200100</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-03</serverCurrentTime>
                        <softId>1001</softId>
                        <softName>DEMO</softName>
                        <softPackageID>DEMO</softPackageID>
                        <softUpdateTime>2025-05-01 00:00:00</softUpdateTime>
                        <versionDetailId>350001</versionDetailId>
                        <versionNo>V10.66</versionNo>
                    </x431PadSoft>
                    <x431PadSoft>
                        <fileSize>55420100</fileSize>
                        <lanId>EN</lanId>
                        <serverCurrentTime>2026-08-03</serverCurrentTime>
                        <softId>1050</softId>
                        <softName>TOYOTA</softName>
                        <softPackageID>TOYOTA</softPackageID>
                        <softUpdateTime>2025-06-10 00:00:00</softUpdateTime>
                        <versionDetailId>360100</versionDetailId>
                        <versionNo>V50.20</versionNo>
                    </x431PadSoft>
                </x431PadSoftList>
            </return>
        </ns1:queryLatestPublicSofts>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
        return res.status(200).send(soapXmlResponse);
    }

    // إذا طلب التطبيق الحزم الفرعية (queryPDTDiagSoftSubPack)
    if (reqBodyStr.includes('queryPDTDiagSoftSubPack')) {
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:queryPDTDiagSoftSubPackResponse xmlns:ns1="https://diagzone.com">
            <queryPDTDiagSoftSubPackReturn>
                <item>
                    <softCode>DEMO</softCode>
                    <subPackName>Demo Package</subPackName>
                    <version>10.66</version>
                </item>
            </queryPDTDiagSoftSubPackReturn>
        </ns1:queryPDTDiagSoftSubPackResponse>
    </soap:Body>
</soap:Envelope>`;
        return res.status(200).send(soapXmlResponse);
    }

    // إذا طلب التطبيق رابط تحميل ملف مباشر من السيرفر (CDN / Download Url)
    if (reqBodyStr.includes('getMaxVersionForMobileAppCDN') || reqBodyStr.includes('getDownloadUrl')) {
        const githubBaseUrl = "https://github.com/USERNAME/REPOSITORY/releases/download/v1.0";
        let fileUrl = `${githubBaseUrl}/Firmware.zip`;

        if (reqBodyStr.includes('DEMO')) {
            fileUrl = `${githubBaseUrl}/DEMO.zip`;
        } else if (reqBodyStr.includes('TOYOTA')) {
            fileUrl = `${githubBaseUrl}/TOYOTA.zip`;
        } else if (reqBodyStr.includes('Diagzone_PRO_V2') || reqBodyStr.includes('1015')) {
            fileUrl = `${githubBaseUrl}/Diagzone_PRO_V2.zip`;
        } else if (reqBodyStr.includes('AUTOSEARCH')) {
            fileUrl = `${githubBaseUrl}/AUTOSEARCH.zip`;
        }

        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:getMaxVersionForMobileAppCDNResponse xmlns:ns1="https://diagzone.com">
            <getMaxVersionForMobileAppCDNReturn>
                <version>2.00.033</version>
                <url>${fileUrl}</url>
                <md5>d41d8cd98f00b204e9800998ecf8427e</md5>
                <updateContent>Download Ready</updateContent>
            </getMaxVersionForMobileAppCDNReturn>
        </ns1:getMaxVersionForMobileAppCDNResponse>
    </soap:Body>
</soap:Envelope>`;
        return res.status(200).send(soapXmlResponse);
    }

    // الاستجابة الأصلية لتسجيل الدخول
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
