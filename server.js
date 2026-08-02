const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BASE_URL = "https://my-diag-server.onrender.com";

// 1. مسار الفحص
app.get('/', (req, res) => {
    res.send('Diag Server is active and running!');
});

// 2. مسار جلب الروابط المعدل (شامل لجميع المفاتيح التي يتطلبها التطبيق)
app.get('/api/v2/urls', (req, res) => {
    console.log('[GET /api/v2/urls] Query:', req.query);

    res.status(200).json({
        code: 0,
        msg: "success",
        data: {
            // المفاتيح المباشرة التي يبحث عنها التطبيق
            "publicsoftservice.nt": BASE_URL,
            "login": `${BASE_URL}/api/v2/user/login`,
            "action_url": BASE_URL,
            
            // قائمة الروابط المعرفة داخل مصفوفة
            urls: [
                { name: "publicsoftservice.nt", url: BASE_URL },
                { name: "login", url: `${BASE_URL}/api/v2/user/login` }
            ]
        }
    });
});

// 3. مسار تسجيل الدخول المتوقع
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

// 4. مسار استقبال تقارير الأخطاء والرفع
app.post('/api/v2/url-upload', (req, res) => {
    console.log('[POST /api/v2/url-upload] Body:', req.body);

    res.status(200).json({
        code: 0,
        msg: "upload success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
