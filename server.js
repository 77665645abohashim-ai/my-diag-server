const express = require('express');
const app = express();

// مصفوفة حفظ سجلات الطلبات للوحة التحكم
let requestLogs = [];

// السماح بقراءة البيانات القادمة بصيغة JSON و Urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// 1️⃣ المسارات الخاصة ببدء إقلاع التطبيق (App Initialization)
// =========================================================

// مسار جلب الروابط والعناوين عند إقلاع التطبيق
app.get('/api/v2/urls', (req, res) => {
    const baseUrl = "https://my-diag-server.onrender.com";

    let time = new Date().toLocaleString();
    requestLogs.unshift({
        time: time,
        serial: 'System / Boot',
        status: 'مقبولة',
        response: `GET /api/v2/urls - تزويد التطبيق بالروابط`
    });

    return res.json({
        code: 0,
        msg: "success",
        data: {
            urls: {
                base_url: baseUrl,
                login_url: baseUrl,
                reg_url: baseUrl,
                download_url: baseUrl
            },
            server_time: Math.floor(Date.now() / 1000)
        }
    });
});

// مسار رفع التقرير والتحقق من القنوات
app.post('/api/v2/url-upload', (req, res) => {
    return res.json({
        code: 0,
        msg: "success",
        data: {}
    });
});


// =========================================================
// 2️⃣ الـ Middleware العام للتعامل مع طلبات تسجيل الدخول
// =========================================================

app.use((req, res, next) => {
    // استثناء الطلبات الخاصة بالمتصفح ولوحة التحكم والأيقونات
    if (req.path === '/favicon.ico' || req.path === '/' || req.path.includes('/dashboard')) {
        return next();
    }

    // التحقق من أن الطلب قادم من التطبيق (OkHttp أو طلبات POST للـ API)
    const isAppRequest = req.headers['user-agent']?.includes('okhttp') || 
                         req.path.includes('login') || 
                         req.path.includes('auth') || 
                         (req.method === 'POST' && (req.body?.url || req.body?.serialNo));

    if (isAppRequest) {
        // قراءة الرقم التسلسلي القادم من التطبيق أو استخدام الافتراضي
        let loginKey = req.body?.serialNo || req.body?.serialno || '979862374489';
        let time = new Date().toLocaleString();

        // تسديد الطلب في قائمة السجلات
        requestLogs.unshift({
            time: time,
            serial: loginKey,
            status: 'مقبولة',
            response: `Path: ${req.path} | Action: ${req.body?.url || 'Direct POST'}`
        });

        // إرجاع استجابة القبول للتطبيق (تم استخدام code: 0 و ret: 0 لضمان القبول)
        return res.json({
            code: 0,
            msg: "success",
            message: "success",
            ret: 0,
            status: 1,
            success: true,
            data: {
                status: 1,
                authorized: true,
                login_key: loginKey,
                serialNo: loginKey,
                token: "9f8e7d6c5b4a3210123456789abcdef0",
                userId: "10088",
                userName: loginKey,
                expireTime: "2099-12-31 23:59:59",
                is_active: 1,
                serverTime: Date.now()
            }
        });
    }

    next();
});

// تشغيل السيرفر على البورت المحدد
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
