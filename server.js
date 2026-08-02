const express = require('express');
const app = express();

// تمكين قراءة البيانات القادمة بصيغة JSON أو Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الهيدر العام لجعل الردود بصيغة UTF-8 JSON
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// 1. مسار تسجيل الدخول الرئيسي (POST /api/v2/login)
app.post('/api/v2/login', (req, res) => {
    console.log("Login Request Received:", req.body);

    const mockToken = "dz_token_987654321_diagzone_session";

    return res.status(200).json({
        code: 0,
        msg: "action success",
        token: mockToken,
        data: {
            token: mockToken,
            access_token: mockToken,
            user_id: "10001",
            username: "diag_user",
            user_type: "1",
            status: "1"
        }
    });
});

// 2. مسار رفع الروابط احتياطياً في حال طلِبه (POST /api/v2/url-upload)
app.post('/api/v2/url-upload', (req, res) => {
    return res.status(200).json({
        code: 0,
        msg: "action success",
        data: {
            url: "https://my-diag-server.onrender.com/api/v2/login",
            host: "https://my-diag-server.onrender.com"
        }
    });
});

// 3. مسار افتراضي لاختبار عمل السيرفر
app.get('/', (req, res) => {
    res.send("DiagZone Custom Server is Running!");
});

// تشغيل السيرفر على البورت المحدد من Render أو 3000 محلياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
