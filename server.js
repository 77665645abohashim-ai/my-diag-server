const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const app = express();
// استخدام المنفذ المخصص من منصة Render تلقائياً
const PORT = process.env.PORT || 10000;

// النطاق الأصلي المراد التوجيه إليه
const TARGET_SERVER = 'https://diagboss.ch';

// ==========================================
// إعداد السيرفر الوسيط (Proxy Middleware)
// ==========================================
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: false, // تجاوز مشاكل شهادات SSL
    selfHandleResponse: true, // يتيح اعتراض الاستجابة وتعديلها

    on: {
        // اعتراض وتعديل الاستجابة القادمة من السيرفر الأصلي
        proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            const requestPath = req.path;

            // 1. اعتراض طلبات تسجيل الدخول والتحقق (/login)
            if (requestPath.includes('/login')) {
                const responseString = responseBuffer.toString('utf8');

                try {
                    let json = JSON.parse(responseString);

                    // تفعيل اشتراك المستخدم وحساب التقني
                    if (json && json.data && json.data.user) {
                        json.data.user.is_365 = true;     
                        json.data.user.tech_status = "1"; 
                    }

                    return JSON.stringify(json);
                } catch (err) {
                    return responseBuffer;
                }
            }

            // 2. اعتراض طلبات الفحص والـ Handshake لتمرير الـ Payload
            if (requestPath.includes('/check') || requestPath.includes('/handshake')) {
                const responseString = responseBuffer.toString('utf8');

                try {
                    let json = JSON.parse(responseString);
                    
                    // إذا أرجع السيرفر الأصلي كود خطأ، يتم تجهيز payload التفعيل
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

            // 3. باقي الطلبات تمر كما هي من السيرفر الأصلي
            return responseBuffer;
        }),
        proxyReq: (proxyReq, req, res) => {
            // ضبط الهيدرات لتطابق السيرفر الأصلي
            proxyReq.setHeader('Host', 'diagboss.ch');
            proxyReq.setHeader('Origin', TARGET_SERVER);
        },
        error: (err, req, res) => {
            console.error('Proxy Error:', err.message);
            res.status(500).json({ code: -1, message: "Proxy Connection Error" });
        }
    }
}));

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Proxy Server active and forwarding to ${TARGET_SERVER} on port ${PORT}`);
});
