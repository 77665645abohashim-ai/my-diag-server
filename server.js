const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: true,
    xfwd: true,
    selfHandleResponse: true, // مهم جداً للتحكم بالاستجابة
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Proxy] Forwarding ${req.method} request to: ${req.url}`);
        },
        proxyRes: (proxyRes, req, res) => {
            let originalBody = Buffer.from([]);

            proxyRes.on('data', (chunk) => {
                originalBody = Buffer.concat([originalBody, chunk]);
            });

            proxyRes.on('end', () => {
                const responseString = originalBody.toString('utf8');
                let modifiedResponse = responseString;

                // إذا كان الطلب يخص تسجيل الدخول أو جلب معلومات الحساب
                if (req.url.includes('/api/v2/login') || req.url.includes('/api/v2/user')) {
                    console.log('>>> [Intercepted User/Login Response - Modifying to VIP/Annual] <<<');
                    try {
                        let jsonResponse = JSON.parse(responseString);
                        
                        // تعديل بيانات الاشتراك والصلاحيات بناءً على الرد الحقيقي الذي ظهر لديك
                        if (jsonResponse.data) {
                            // تفعيل الاشتراك السنوي
                            jsonResponse.data.is_365 = true; 
                            
                            if (jsonResponse.data.user) {
                                // رفع صلاحيات المستخدم إلى مستوى مشرف أو حساب مفعل بالكامل إذا لزم
                                jsonResponse.data.user.roles = "9"; // أو الصلاحية المناسبة
                                jsonResponse.data.user.tech_status = "1"; // حالة فني نشط
                            }
                        }
                        
                        modifiedResponse = JSON.stringify(jsonResponse);
                        console.log('>>> [Response Modified Successfully: Annual Subscription Active] <<<');
                    } catch (e) {
                        console.log('Error parsing JSON response:', e.message);
                    }
                }

                // تمرير الهيدرز والرد (سواء تم تعديله أو كما هو) للتطبيق
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                res.end(modifiedResponse);
            });
        }
    }
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Intercepting Proxy Server is running on port ${PORT}`);
});
