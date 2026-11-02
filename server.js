const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسار ديناميكي عام يتعامل مع جميع الملفات بنفس كفاءة ملف login
app.all('/api/v2/:endpoint', (req, res) => {
    let endpointName = req.params.endpoint;
    
    if (endpointName === 'urls') {
        endpointName = 'urls?config_no=0&app_id=3';
    }
    
    const filePath = path.join(__dirname, endpointName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`[تنبيه] الملف غير موجود: ${endpointName}`);
        return res.status(404).json({ code: -1, msg: `File ${endpointName} not found` });
    }
    
    console.log(`طلب وارد -> قراءة ملف الهيدرات والبيانات: ${endpointName}`);
    
    fs.readFile(filePath, 'utf8', (err, rawData) => {
        if (err) {
            console.error(`خطأ في قراءة الملف ${endpointName}:`, err);
            return res.status(500).json({ code: -1, msg: "Read file error" });
        }
        
        const lines = rawData.split(/\r?\n/);
        let bodyStartIndex = 0;
        const extractedHeaders = {};
        
        // 1. استخراج الهيدرات من أعلى الملف (مثل ما حدث مع ملف login تماماً)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // إذا وصلنا إلى بداية الـ JSON (يبدأ بـ { أو [) نتوقف عن قراءة الهيدرات
            if (line.startsWith('{') || line.startsWith('[')) {
                bodyStartIndex = i;
                break;
            }
            
            // التقاط الهيدرات التي تحتوي على نقطتين رأسيتين
            if (line.includes(':') && !line.startsWith('HTTP/')) {
                const colonIndex = line.indexOf(':');
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                
                // استبعاد الهيدرات الخاصة بسيرفر السحابي القديم لتجنب التعارض
                if (!['server', 'content-encoding', 'transfer-encoding', 'alt-svc', 'cf-ray', 'cf-cache-status', 'connection'].includes(key.toLowerCase())) {
                    extractedHeaders[key] = value;
                }
            }
        }
        
        // 2. تجميع جسم الـ JSON من الأسفل
        const jsonBody = lines.slice(bodyStartIndex).join('\n');
        
        // 3. تطبيق الهيدرات المستخرجة على الاستجابة الحالية
        for (const [key, value] of Object.entries(extractedHeaders)) {
            try {
                res.setHeader(key, value);
            } catch (e) {
                // تجاهل أي هيدر غير مدعوم
            }
        }
        
        // فرض الهيدرات الإجبارية لمنع التخزين المؤقت
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        
        // التأكد من أن نوع المحتوى application/json دائماً إذا كان البودي JSON
        if (jsonBody.trim().startsWith('{') || jsonBody.trim().startsWith('[')) {
            if (!res.getHeader('Content-Type') || res.getHeader('Content-Type').includes('text/html')) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
        }
        
        // 4. إرسال المحتوى كاملاً كما تم التقاطه من ملفه المخصص
        return res.status(200).send(jsonBody);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
