const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// إعداد الهيدر التلقائي بناءً على محتوى الطلب
app.use((req, res, next) => {
    let bodyStr = "";
    if (typeof req.body === 'string') {
        bodyStr = req.body;
    } else if (Buffer.isBuffer(req.body)) {
        bodyStr = req.body.toString();
    } else {
        bodyStr = JSON.stringify(req.body || {});
    }

    if (bodyStr.includes('Envelope')) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    } else {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
});

// معالجة مسار اللوجن والـ SOAP بجميع دواله
app.post('/api/v2/login', (req, res) => {
    let reqBodyStr = "";
    if (typeof req.body === 'string') {
        reqBodyStr = req.body;
    } else if (Buffer.isBuffer(req.body)) {
        reqBodyStr = req.body.toString();
    } else {
        reqBodyStr = JSON.stringify(req.body || {});
    }

    // 1. إذا كان طلب SOAP لجلب الماركات والتراخيص
    if (reqBodyStr.includes('getRegisteredProductsForPad46')) {
        console.log("[SOAP] Responding with DEMO V15.86 for Serial: 979862374489");
        
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:getRegisteredProductsForPad46Response xmlns:ns1="https://diagzone.com">
            <getRegisteredProductsForPad46Return>
                <item>
                    <softCode>DEMO</softCode>
                    <softName>DEMO V15.86</softName>
                    <expireDate>2099-12-31</expireDate>
                    <status>1</status>
                    <type>PRO</type>
                    <version>15.86</version>
                </item>
            </getRegisteredProductsForPad46Return>
        </ns1:getRegisteredProductsForPad46Response>
    </soap:Body>
</soap:Envelope>`;

        return res.status(200).send(soapXmlResponse);
    }

    // 2. إذا كان طلب SOAP للتحقق من أحدث إصدار للبرنامج/التطبيق (CDN)
    if (reqBodyStr.includes('getMaxVersionForMobileAppCDN')) {
        console.log("[SOAP] Responding with Max Version for SmartLink / App CDN");

        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:Body>
        <ns1:getMaxVersionForMobileAppCDNResponse xmlns:ns1="https://diagzone.com">
            <getMaxVersionForMobileAppCDNReturn>
                <version>2.00.027</version>
                <url>https://my-diag-server.onrender.com/download/dummy.zip</url>
                <md5>d41d8cd98f00b204e9800998ecf8427e</md5>
                <updateContent>Latest stable version for serial 979862374489</updateContent>
            </getMaxVersionForMobileAppCDNReturn>
        </ns1:getMaxVersionForMobileAppCDNResponse>
    </soap:Body>
</soap:Envelope>`;

        return res.status(200).send(soapXmlResponse);
    }

    // 3. وإلا فهو طلب تسجيل الدخول العادي (JSON)
    console.log("[LOGIN] Standard Login Request received for Serial: 979862374489");
    const SERIAL_NUMBER = "979862374489";
    const mockToken = "dz_token_979862374489_session";

    return res.status(200).json({
        code: 0,
        msg: "action success",
        token: mockToken,
        data: {
            token: mockToken,
            access_token: mockToken,
            user: {
                user_id: "10001",
                user_name: SERIAL_NUMBER,
                nick_name: SERIAL_NUMBER,
                token: mockToken,
                user_type: "1",
                status: "1"
            },
            deviceUser: {
                serialNo: SERIAL_NUMBER,
                serial_no: SERIAL_NUMBER,
                serial_number: SERIAL_NUMBER
            },
            loginUser: {
                user_name: SERIAL_NUMBER,
                nick_name: SERIAL_NUMBER
            }
        }
    });
});

// مسار الإحصائيات والتفعيل
app.post('/api/v2/statistics', (req, res) => {
    console.log("[STATISTICS] Request received");
    return res.status(200).json({
        code: 0,
        msg: "success",
        data: {
            user_id: 10001,
            bool: "1",
            status: "1",
            is_active: "1"
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
