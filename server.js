const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

// إعدادات قراءة البيانات المرسلة من التطبيق
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// 1. منع التخزين المؤقت (Cache) لضمان جلب التحديثات فوراً
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// 2. نظام الوسيط الشامل (Global Proxy) لجميع مسارات التطبيق
app.all('*', async (req, res) => {
    try {
        const fullTargetUrl = `${TARGET_SERVER}${req.originalUrl}`;
        console.log(`[Proxy] Forwarding ${req.method} request to: ${fullTargetUrl}`);

        // إرسال الطلب بنفس البيانات والـ Headers إلى السيرفر الأصلي
        const response = await axios({
            method: req.method,
            url: fullTargetUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: 'diagboss.ch' // إجبار الهوست ليتطابق مع السيرفر الأصلي
            },
            validateStatus: () => true // استقبال أي استجابة (حتى لو كانت خطأ) لتجنب توقف الكود
        });

        let responseData = response.data;

        // 3. التعديل التلقائي على الردود القادمة من السيرفر الأصلي
        if (responseData && typeof responseData === 'object') {
            
            // تعديل أي رابط تحميل (url) قد يرسله السيرفر الأصلي ليطابق رابطك الجديد
            if (responseData.data) {
                if (typeof responseData.data.url === 'string') {
                    responseData.data.url = 'https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1.0/DEMO.zip';
                }
                // إذا كان الرد عبارة عن مصفوفة روابط (urls)
                if (Array.isArray(responseData.data.urls)) {
                    responseData.data.urls.forEach(item => {
                        if (item.value && item.value.includes('download')) {
                            item.value = 'https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1.0/DEMO.zip';
                        }
                    });
                }
            }
        }

        // 4. إرسال الرد (بعد تعديله) إلى التطبيق
        res.status(response.status).json(responseData);

    } catch (error) {
        console.error('[Proxy Error]:', error.message);
        
        // الرد الاحتياطي في حال انقطع الاتصال كلياً بالسيرفر الأصلي
        res.status(500).json({
            code: -1,
            msg: "Global proxy connection failed",
            data: {}
        });
    }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Global Proxy Server listening on port ${PORT}`);
});
