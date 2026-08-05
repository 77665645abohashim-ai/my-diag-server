const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// النطاق الأصلي المراد التوجيه إليه
const TARGET_SERVER = 'https://diagboss.ch';

// ==========================================
// إعداد السيرفر الوسيط (Proxy Middleware)
// ==========================================
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: false, // يتجاوز مشاكل شهادات SSL ذاتية التوقيع إن وجدت
    selfHandleResponse: true, // يتيح اعتراض الاستجابة القادمة من السيرفر الأصلي وتعديلها

    on: {
        // اعتراض وتعديل الاستجابة القادمة من https://diagboss.ch
        proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            const requestPath = req.path;

            // 1. اعتراض طلبات تسجيل الدخول والتحقق (/api/v2/login)
            if (requestPath.includes('/login')) {
                const responseString = responseBuffer.toString('utf8');

                try {
                    let json = JSON.parse(responseString);

                    // إذا كانت الاستجابة تحتوي على بيانات المستخدم
                    if (json && json.data && json.data.user) {
                        json.data.user.is_365 = true;     // تفعيل الاشتراك السنوي
                        json.data.user.tech_status = "1";  // تفعيل الحالة ورفع الحظر
                    }

                    // إعادة طباعة الـ JSON المعدل كاستجابة للتطبيق
                    return JSON.stringify(json);
                } catch (err) {
                    // في حال كان الرد ليس JSON (مثلاً SOAP/XML)، يُمكّن الكود من التمرير بدون تعديل
                    return responseBuffer;
                }
            }

            // 2. اعتراض طلبات الفحص والـ Handshake لتمرير الـ Payload المشفر إن لزم
            if (requestPath.includes('/check') || requestPath.includes('/handshake')) {
                const responseString = responseBuffer.toString('utf8');

                try {
                    let json = JSON.parse(responseString);
                    
                    // إذا أرجع السيرفر الأصلي كود خطأ أو استجابة فارغة، نقوم بإضافة payload التفعيل
                    if (!json.data || json.code !== 0) {
                        json.code = 0;
                        json.message = "OK";
                        json.data = "AgAAAAAACAAEAAAAEAAGAAMAcQAAAARsWT1D357sEZgy9KR/cczvOBURWFP+bBGYMvSkf3HM7zgVEVhT";
                    }

                    return JSON.stringify(json);
                } catch (err) {
                    return responseBuffer;
                }
            }

            // 3. باقي جميع الطلبات (تحميل الماركات، الملفات، الاستعلامات) تمر كما هي من السيرفر الأصلي
            return responseBuffer;
        }),
        proxyReq: (proxyReq, req, res) => {
            // ضبط الهيدرات لتبدو وكأنها مرسلة مباشرة من التطبيق إلى diagboss.ch
            proxyReq.setHeader('Host', 'diagboss.ch');
            proxyReq.setHeader('Origin', TARGET_SERVER);
        },
        error: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.status(500).json({ code: -1, message: "Proxy Connection Error" });
        }
    }
}));

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Proxy Server active and forwarding to ${TARGET_SERVER} on port ${PORT}`);
});
