const express = require('express');
const app = express();

// تحديد البورت (المنفذ)، إما من بيئة العمل أو الافتراضي 3000
const PORT = process.env.PORT || 3000;

// Middleware لقراءة بيانات الـ JSON القادمة من التطبيق
app.use(express.json());

// Middleware بسيط لتسجيل الطلبات القادمة (للمراقبة في الـ Console)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

// ================= ديانات واختبار السيرفر ================= //

// مسار رئيسي للتأكد من أن السيرفر يعمل
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Mobile App API Server is running successfully!',
        version: '1.0.0'
    });
});

// ================= مسارات التطبيق (API Endpoints) ================= //

// 1. مسار تسجيل الدخول (Login)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // مثال تجريبي للتحقق (استبدله لاحقاً بقاعدة بيانات حقيقية)
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
    }

    // افتراض نجاح العملية
    res.status(200).json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        token: 'sample-jwt-token-xyz123',
        user: { id: 1, email: email, name: 'مستخدم التطبيق' }
    });
});

// 2. مسار تسجيل حساب جديد (Register)
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }

    res.status(201).json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: { id: Date.now(), name, email }
    });
});

// 3. مسار استلام بيانات أو إرسالها من التطبيق (مثال: بيانات تشخيص أو طلبات)
app.post('/api/data/submit', (req, res) => {
    const appData = req.body;

    console.log('تم استقبال البيانات من التطبيق:', appData);

    // معالجة البيانات هنا...

    res.status(200).json({
        success: true,
        message: 'تم استقبال البيانات ومعالجتها بنجاح',
        receivedData: appData
    });
});

// ================= تشغيل السيرفر ================= //
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
