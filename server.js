const express = require('express');
const multer = require('multer');
const upload = multer();
const app = express();

// 1. تمكين قراءة البيانات بكافة الصيع (JSON, Form-Data, UrlEncoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any()); // لفك بيانات multipart/form-data من التطبيق

// 2. ضبط الهيدر العام للردود UTF-8 JSON
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// 3. مسار تسجيل الدخول الرئيسي (POST /api/v2/login)
app.post('/api/v2/login', (req, res) => {
    console.log("-----------------------------------------");
    console.log("Received Body:", req.body);

    // استقبال اسم المستخدم المبعوث أو اعتماد الحساب الافتراضي
    const username = req.body.login_key || req.body.username || "979862374489";
    const SERIAL_NUMBER = "979862374489";
    const mockToken = "dz_token_979862374489_session";

    console.log(`[SUCCESS] Login accepted for user: ${username}`);

    // إرجاع استجابة النجاح المكتملة 100% لتفادي أي خطأ داخل التطبيق
    return res.status(200).json({
        code: 0,
        msg: "action success",
        token: mockToken,
        data: {
            token: mockToken,
            access_token: mockToken,
            // كائن المستخدم المباشر لدعم الدالة P
            user: {
                user_id: "10001",
                user_name: username,
                nick_name: username,
                token: mockToken,
                user_type: "1",
                status: "1"
            },
            // بيانات الجهاز والرقم التسلسلي
            deviceUser: {
                serialNo: SERIAL_NUMBER,
                serial_no: SERIAL_NUMBER,
                serial_number: SERIAL_NUMBER
            },
            loginUser: {
                user_name: username,
                nick_name: username
            }
        }
    });
});

// 4. مسار رفع الروابط (POST /api/v2/url-upload)
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

// 5. مسار الصفحة الرئيسية لاختبار السيرفر
app.get('/', (req, res) => {
    res.send("DiagZone Custom Server is Running Successfully!");
});

// 6. تشغيل السيرفر على منفذ Render أو 3000 محلياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
