const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// إعداد الـ Proxy متوافق مع الإصدار v3.0.0
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: true,
    xfwd: true,
    selfHandleResponse: true, // للسماح لنا بالتحكم بالرد وتعديله
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Proxy] Forwarding ${req.method} request to original server: ${req.url}`);
        },
        proxyRes: (proxyRes, req, res) => {
            let originalBody = Buffer.from([]);

            // جمع البيانات القادمة من السيرفر الأصلي
            proxyRes.on('data', (chunk) => {
                originalBody = Buffer.concat([originalBody, chunk]);
            });

            // عند اكتمال استلام الرد
            proxyRes.on('end', () => {
                const responseString = originalBody.toString('utf8');
                let modifiedResponse = responseString;

                // إذا كان الطلب هو مسار تسجيل الدخول، قم بتعديل الرد
                if (req.url.includes('/api/v2/login')) {
                    console.log('>>> [Intercepted Login Response from Original Server] <<<');
                    try {
                        let jsonResponse = JSON.parse(responseString);
                        
                        // تعديل بيانات الصلاحية والتفعيل
                        if (jsonResponse.data) {
                            jsonResponse.data.status = "active";
                            jsonResponse.data.expireDate = "2099-12-31";
                        }
                        jsonResponse.success = true;
                        
                        modifiedResponse = JSON.stringify(jsonResponse);
                        console.log('>>> [Response Modified Successfully] <<<');
                    } catch (e) {
                        console.log('Error parsing JSON response:', e.message);
                    }
                }

                // إرسال الرد المعدل إلى التطبيق
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                res.end(modifiedResponse);
            });
        }
    }
}));

// ربط السيرفر بالمنفذ المخصص مع 0.0.0.0 لضمان عمله على Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Intercepting Proxy Server is running on port ${PORT}`);
});
