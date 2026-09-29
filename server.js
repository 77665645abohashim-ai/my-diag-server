const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;
const TARGET_SERVER = 'https://diagboss.ch';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// مسار الـ Proxy مع القدرة على تعديل الرد القادم من السيرفر الأصلي
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    secure: true,
    xfwd: true,
    selfHandleResponse: true, // مهم جداً: للسماح لنا بالتحكم بالرد وتعديله
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] Forwarding ${req.method} request to original server: ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        let originalBody = Buffer.from([]);

        // جمع البيانات القادمة من السيرفر الأصلي قطعة قطعة
        proxyRes.on('data', (chunk) => {
            originalBody = Buffer.concat([originalBody, chunk]);
        });

        // عند اكتمال استلام الرد من السيرفر الأصلي
        proxyRes.on('end', () => {
            const responseString = originalBody.toString('utf8');
            let modifiedResponse = responseString;

            // إذا كان الطلب هو مسار تسجيل الدخول، يمكنك تعديل الرد هنا!
            if (req.url.includes('/api/v2/login')) {
                console.log('>>> [Intercepted Login Response from Original Server] <<<');
                try {
                    let jsonResponse = JSON.parse(responseString);
                    
                    // تعديل البيانات (مثلاً: تفعيل الحساب، تغيير تاريخ الانتهاء، إلخ)
                    if (jsonResponse.data) {
                        jsonResponse.data.status = "active";
                        jsonResponse.data.expireDate = "2099-12-31";
                        // يمكنك أيضاً تعديل الصلاحيات أو الفئات المفعلة حسب هيكلة الرد لديهم
                    }
                    jsonResponse.success = true;
                    
                    modifiedResponse = JSON.stringify(jsonResponse);
                    console.log('>>> [Response Modified Successfully] <<<');
                } catch (e) {
                    console.log('Error parsing JSON response:', e.message);
                }
            }

            // نسخ الهيدرز الأصلية للسيرفر
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            // إرسال الرد (سواء تم تعديله أو كما هو) إلى التطبيق
            res.end(modifiedResponse);
        });
    }
}));

app.listen(PORT, () => {
    console.log(`Intercepting Proxy Server is running on port ${PORT}`);
});
