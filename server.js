const express = require('express');
const app = express();

// Middleware لمعالجة البيانات القادمة بجميع الصيغ (JSON و URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BASE_URL = "https://my-diag-server.onrender.com";

// 1. مسار الفحص الرئيسي
app.get('/', (req, res) => {
    res.send('Diag Server is active and running!');
});

// 2. مسار جلب الروابط والإعدادات (GET /api/v2/urls)
// يُرجع الهيكل الكامل الذي يطلبه التطبيق لمعرفة مسارات الخدمات
app.get('/api/v2/urls', (req, res) => {
    console.log('[GET /api/v2/urls] Query:', req.query);

    res.status(200).json({
        code: 0,
        msg: "success",
        data: {
            // تقديم مسارات الخدمات كمفاتيح وداخل مصفوفة لتغطية كافة الاحتمالات
            login: `${BASE_URL}/api/v2/user/login`,
            action_url: BASE_URL,
            "publicsoftservice.nt": `${BASE_URL}/api/v2/publicservice`,
            urls: [
                { name: "login", url: `${BASE_URL}/api/v2/user/login` },
                { name: "publicsoftservice.nt", url: `${BASE_URL}/api/v2/publicservice` }
            ]
        }
    });
});

// 3. مسار تسجيل الدخول التجريبي (POST /api/v2/user/login)
app.post('/api/v2/user/login', (req, res) => {
    console.log('[POST /api/v2/user/login] Received Body:', req.body);

    res.status(200).json({
        code: 0,
        msg: "success",
        data: {
            token: "diag_mock_token_998877",
            user_id: "1001",
            username: req.body.username || "admin"
        }
    });
});

// 4. مسار تقارير الأخطاء والـ Log (POST /api/v2/url-upload)
app.post('/api/v2/url-upload', (req, res) => {
    console.log('[POST /api/v2/url-upload] Body:', req.body);

    res.status(200).json({
        code: 0,
        msg: "upload success"
    });
});

// 5. مسار الخدمات العامة الاحتياطي
app.post('/api/v2/publicservice', (req, res) => {
    res.status(200).json({
        code: 0,
        msg: "success",
        data: {}
    });
});

// تحديد المنفذ وتشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
