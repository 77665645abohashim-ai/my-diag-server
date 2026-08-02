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

// مسار تسجيل الدخول الرئيسي (POST /api/v2/login)
app.post('/api/v2/login', (req, res) => {
    const { username, password } = req.body;

    console.log(`محاولة دخول - اسم المستخدم: ${username} | كلمة المرور: ${password}`);

    // البيانات المعتمدة المسموح لها بالدخول
    const VALID_USER = "979862374489";
    const VALID_PASS = "776656456";
    const SERIAL_NUMBER = "979862374489"; // الرقم التسلسلي المعتمد للقطعة

    // 1. التحقق من صحة بيانات الدخول
    if (username !== VALID_USER || password !== VALID_PASS) {
        return res.status(200).json({
            code: 1001,
            msg: "اسم المستخدم أو كلمة المرور غير صحيحة!",
            data: null
        });
    }

    // 2. إذا كانت البيانات صحيحة -> إرجاع كائن النجاح الهيكلي الكامل
    const mockToken = "dz_token_979862374489_session";

    return res.status(200).json({
        code: 0,
        msg: "action success",
        token: mockToken,
        data: {
            token: mockToken,
            access_token: mockToken,
            // كائن المستخدم الرئيسي
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

// مسار رفع الروابط احتياطياً في حال طلِبه التطبيق (POST /api/v2/url-upload)
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

// مسار افتراضي لاختبار عمل السيرفر
app.get('/', (req, res) => {
    res.send("DiagZone Custom Server is Running!");
});

// تشغيل السيرفر على البورت المحدد من Render أو 3000 محلياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
