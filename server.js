const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/xml', 'application/xml', '*/*'] }));

app.use((req, res, next) => {
    if (req.body && typeof req.body === 'string' && req.body.includes('Envelope')) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    } else {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
});

app.all('*', (req, res) => {
    console.log("-----------------------------------------");
    console.log("Request Path:", req.path);
    
    const reqBodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

    // 1. معالجة طلب جلب المنتجات والتراخيص المرتبطة بالرقم التسلسلي (SOAP)
    if (reqBodyStr.includes('getRegisteredProductsForPad46') || reqBodyStr.includes('Envelope')) {
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

    // 2. رد تسجيل الدخول وإرجاع بيانات الجهاز والرقم التسلسلي (JSON)
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
                user_name: "979862374489",
                nick_name: "979862374489",
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
                user_name: "979862374489",
                nick_name: "979862374489"
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
