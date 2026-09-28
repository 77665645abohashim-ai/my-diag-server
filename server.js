const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// الرابط الأساسي للسيرفر الأصلي
const ORIGINAL_SERVER = "https://diagboss.ch";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسار افتتاحي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send("Proxy Server is Running Successfully!");
});

// ==========================================
// السيرفر الوسيط العام مع اعتراض وتعديل الردود
// ==========================================
app.all('/api/v2/*', async (req, res) => {
    try {
        const targetUrl = `${ORIGINAL_SERVER}${req.originalUrl}`;
        console.log(`Proxying & Intercepting ${req.method} request to: ${targetUrl}`);

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: new URL(ORIGINAL_SERVER).host
            },
            responseType: 'arraybuffer', // لضمان التعامل مع جميع أنواع البيانات (JSON، ملفات، نصوص)
            validateStatus: () => true
        });

        let responseBody = response.data;

        // محاولة فحص الرد وتعديله إذا كان بصيغة JSON
        try {
            const stringData = Buffer.from(responseBody).toString('utf8');
            let jsonData = JSON.parse(stringData);

            // ==========================================
            // [منطقة التعديل]: عدل على jsonData بالشكل الذي تريده
            // ==========================================
            // مثال توضيحي:
            // if (jsonData.code !== undefined) {
            //     jsonData.code = 0; // فرض أن العملية ناجحة دائماً
            // }

            // إعادة تحويل الـ JSON المعدل إلى Buffer
            responseBody = Buffer.from(JSON.stringify(jsonData), 'utf8');
            
            // تحديث حجم البيانات المرسلة
            res.setHeader('Content-Length', responseBody.length);

        } catch (e) {
            // إذا لم يكن الرد JSON (مثلاً ملف ثنائي أو نص عادي)، سيمر كما هو بدون أي تغيير
        }

        // نسخ الهيدرات الأصلية وإرسال الرد (بعد التعديل أو كما هو) للتطبيق
        res.set(response.headers);
        return res.status(response.status).send(responseBody);

    } catch (error) {
        console.error("Proxy error:", error.message);
        return res.status(500).send("Proxy Server Error");
    }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`);
});
