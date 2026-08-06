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
            "publicsoftws.action": `${MY_SERVER_URL}/publicsoftservice`,
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
// 5. مسار التحديثات الشامل (الماركات + الـ Firmware والتطبيق)
// ----------------------------------------------------
app.all(['/publicsoftservice', '/publicsoftservice-nt', '/diagsoftservice'], (req, res) => {
    res.set('Content-Type', 'text/xml; charset=utf-8');

    // كود XML يدمج الماركات مع البرمجيات العامة ليراها التطبيق في جدول التحديثات
    const xmlResponse = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <queryLatestVersionResponse xmlns="http://service.publicsoft.cc.com">
            <out>
                <code>0</code>
                <message>success</message>
                <result>
                    <!-- التحديثات الأساسية -->
                    <item>
                        <softPackageId>Firmware</softPackageId>
                        <softPackageName>Firmware</softPackageName>
                        <version>V11.91</version>
                        <url>${MY_SERVER_URL}/files/Firmware_V11.91.zip</url>
                    </item>
                    <item>
                        <softPackageId>Diagzone PRO V2</softPackageId>
                        <softPackageName>Diagzone PRO V2</softPackageName>
                        <version>V2.00.033</version>
                        <url>${MY_SERVER_URL}/files/DiagPro_V2.apk</url>
                    </item>

                    <!-- ماركات السيارات -->
                    <item>
                        <softPackageId>DEMO</softPackageId>
                        <softPackageName>DEMO</softPackageName>
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
                        <softPackageId>TOYOTA</softPackageId>
                        <softPackageName>TOYOTA / LEXUS</softPackageName>
                        <version>V50.10</version>
                        <url>${MY_SERVER_URL}/files/TOYOTA_V50.10.zip</url>
                    </item>
                    <item>
                        <softPackageId>VOLKSWAGEN</softPackageId>
                        <softPackageName>VW / AUDI</softPackageName>
                        <version>V28.50</version>
                        <url>${MY_SERVER_URL}/files/VW_V28.50.zip</url>
                    </item>
                    <item>
                        <softPackageId>BENZ</softPackageId>
                        <softPackageName>MERCEDES-BENZ</softPackageName>
                        <version>V49.90</version>
                        <url>${MY_SERVER_URL}/files/BENZ_V49.90.zip</url>
                    </item>
                    <item>
                        <softPackageId>BMW</softPackageId>
                        <softPackageName>BMW / MINI</softPackageName>
                        <version>V50.00</version>
                        <url>${MY_SERVER_URL}/files/BMW_V50.00.zip</url>
                    </item>
                    <item>
                        <softPackageId>HYUNDAI</softPackageId>
                        <softPackageName>HYUNDAI</softPackageName>
                        <version>V51.00</version>
                        <url>${MY_SERVER_URL}/files/HYUNDAI_V51.00.zip</url>
                    </item>
                    <item>
                        <softPackageId>KIA</softPackageId>
                        <softPackageName>KIA</softPackageName>
                        <version>V45.00</version>
                        <url>${MY_SERVER_URL}/files/KIA_V45.00.zip</url>
                    </item>
                </result>
            </out>
        </queryLatestVersionResponse>
    </soap:Body>
</soap:Envelope>`;

    res.send(xmlResponse);
});

// ----------------------------------------------------
// 6. مسار الفحص والإحصائيات وتأكيد الحساب
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
// 7. تشغيل الاستماع على البورت المحدد
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Diag Server Running on Port: ${PORT}`);
    console.log(`🌐 Base URL: ${MY_SERVER_URL}`);
    console.log(`=================================`);
});
