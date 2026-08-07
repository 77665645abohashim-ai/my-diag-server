const express = require('express');
const app = express();

// قراءة البيانات المرسلة بصيغة JSON أو Form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// طباعة الطلبات الواردة للمساعدة في المراقبة والتصحيح (Logging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// 1. مسار تسجيل الدخول أو المصادقة (إذا كان مطلوباً تخصيصه)
app.all(['/api/v2/login', '/login', '/api/login'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "message": "OK",
        "data": {
            "token": "mock-token-diags-12345",
            "user_id": "1",
            "username": "admin"
        }
    });
});

// 2. مسار رفع الروابط أو الملفات (تم إضافته لتجنب أخطاء التطبيق)
app.all(['/api/v2/url-upload', '/url-upload'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "message": "OK",
        "data": {
            "url": "",
            "success": true
        }
    });
});

// 3. مسار عام للتعامل مع أي طلبات أخرى واردة من التطبيق
app.all('*', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "message": "OK",
        "data": {}
    });
});

// تحديد المنفذ وتشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Diag Server is running on port ${PORT}`);
});
