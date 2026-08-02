const express = require('express');
const app = express();

// استخدام Middleware لمعالجة بيانات JSON والـ URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. مسار الفحص الرئيسي والتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send('Diag Server is running successfully!');
});

// 2. حل مشكلة الـ 404: مسار جلب الروابط والإعدادات (GET /api/v2/urls)
app.get('/api/v2/urls', (req, res) => {
    const configNo = req.query.config_no;
    const appId = req.query.app_id;

    console.log(`[GET /api/v2/urls] Request received with config_no=${configNo}, app_id=${appId}`);

    // إرجاع استجابة قياسية للتطبيق لتجاوز خطأ 404
    res.status(200).json({
        code: 0,
        msg: "success",
        data: {
            urls: []
        }
    });
});

// 3. مسار رفع الروابط (POST /api/v2/url-upload)
app.post('/api/v2/url-upload', (req, res) => {
    console.log('[POST /api/v2/url-upload] Data received:', req.body);

    res.status(200).json({
        code: 0,
        msg: "upload success"
    });
});

// تحديد المنفذ (Port) الخاص ببيئة Render أو 3000 محلياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
