const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ----------------------------------------------------
// 1. الإعدادات والوسائط (Middlewares)
// ----------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.text({ type: ['text/xml', 'application/xml', 'text/plain'] }));
app.use(express.urlencoded({ extended: true }));

// مجلد الملفات العامة (لتخزين ملفات الـ ZIP الخاصة بالماركات والـ APK)
app.use('/files', express.static(path.join(__dirname, 'public/files')));

// ضع هنا رابط سيرفرك الأساسي على Render أو أي استضافة أخرى
const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

// ----------------------------------------------------
// 2. طباعة الطلبات الواردة للمراقبة (Logging)
// ----------------------------------------------------
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// ----------------------------------------------------
// 3. مسار توجيه الروابط الأساسية (/urls)
// ----------------------------------------------------
app.all('/urls', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "publicsoft.download": `${MY_SERVER_URL}/files`,
            "downloaddiagsoftws.action": `${MY_SERVER_URL}/diagsoftservice`,
            "login.action": `${MY_SERVER_URL}/login`,
            "register.action": `${MY_SERVER_URL}/register`,
            "queryPDTDiagSoftSubPack": `${MY_SERVER_URL}/diagsoftservice`
        }
    });
});

// ----------------------------------------------------
// 4. مسار تسجيل الدخول والمصادقة (/login)
// ----------------------------------------------------
app.all('/login', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "token": "YmxrVCtaaEVJNWUrWWhhcVY5VHIvdz09",
            "user_id": "10001",
            "username": "DiagZoneVIP",
            "xmpp_host": "jabber.diagzone.com",
            "xmpp_port": 5222
        }
    });
});

// ----------------------------------------------------
// 5. مسار خدمات الماركات والتحديثات (/diagsoftservice)
// ----------------------------------------------------
app.all('/diagsoftservice', (req, res) => {
    res.set('Content-Type', 'text/xml; charset=utf-8');

    // كود XML يرجع قائمة الماركات مع روابط التحميل المباشرة
    const xmlResponse = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <queryPDTDiagSoftSubPackResponse xmlns="http://service.publicsoft.cc.com">
            <out>
                <code>0</code>
                <message>success</message>
                <result>
                    <item>
                        <softPackageId>DEMO</softPackageId>
                        <softPackageName>DEMO Program</softPackageName>
                        <version>V15.00</version>
                        <url>${MY_SERVER_URL}/files/DEMO_V15.00.zip</url>
                    </item>
                    <item>
                        <softPackageId>EOBD2</softPackageId>
                        <softPackageName>EOBD2 Protocol</softPackageName>
                        <version>V22.80</version>
                        <url>${MY_SERVER_URL}/files/EOBD2_V22.80.zip</url>
                    </item>
                    <item>
                        <softPackageId>VW</softPackageId>
                        <softPackageName>Volkswagen</softPackageName>
                        <version>V28.50</version>
                        <url>${MY_SERVER_URL}/files/VW_V28.50.zip</url>
                    </item>
                    <item>
                        <softPackageId>TOYOTA</softPackageId>
                        <softPackageName>Toyota / Lexus</softPackageName>
                        <version>V50.10</version>
                        <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                    </item>
                    <item>
                        <softPackageId>BENZ</softPackageId>
                        <softPackageName>Mercedes-Benz</softPackageName>
                        <version> V49.90</version>
                        <url>${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
                    </item>
                    <item>
                        <softPackageId>BMW</softPackageId>
                        <softPackageName>BMW / Mini</softPackageName>
                        <version>V50.00</version>
                        <url>${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
                    </item>
                </result>
            </out>
        </queryPDTDiagSoftSubPackResponse>
    </soap:Body>
</soap:Envelope>`;

    res.send(xmlResponse);
});

// ----------------------------------------------------
// 6. مسار تحديث التطبيق الرئيسي (/publicsoftservice)
// ----------------------------------------------------
app.all(['/publicsoftservice', '/publicsoftservice-nt'], (req, res) => {
    res.set('Content-Type', 'text/xml; charset=utf-8');

    const xmlResponse = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <getLatestVersionResponse xmlns="http://service.publicsoft.cc.com">
            <out>
                <code>0</code>
                <message>success</message>
                <version>2.00.000</version>
                <downloadUrl>${MY_SERVER_URL}/files/DiagPro_V2.apk</downloadUrl>
            </out>
        </getLatestVersionResponse>
    </soap:Body>
</soap:Envelope>`;

    res.send(xmlResponse);
});

// ----------------------------------------------------
// 7. مسار الفحص، الإحصائيات ورصد الأخطاء
// ----------------------------------------------------
app.all(['/product-service', '/statistics', '/url-upload', '/register'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "dzKey": "8888888888888888",
            "status": "ACTIVE"
        }
    });
});

// ----------------------------------------------------
// 8. تشغيل الاستماع على البورت المحدد
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Diag Server Running on Port: ${PORT}`);
    console.log(`🌐 Base URL: ${MY_SERVER_URL}`);
    console.log(`=================================`);
});
