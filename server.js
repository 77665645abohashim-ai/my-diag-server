const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسار عام يتعامل مع جميع الـ Endpoints ويطابقها مع اسم الملف مباشرة
app.all('/api/v2/:endpoint', (req, res) => {
    let endpointName = req.params.endpoint;
    
    // إذا كان الطلب يخص ملف الروابط (urls) بغض النظر عن الـ Query Parameters
    if (endpointName === 'urls') {
        endpointName = 'urls?config_no=0&app_id=3'; // أو اسم ملف الروابط لديك
    }
    
    const filePath = path.join(__dirname, endpointName);
    
    // التحقق من وجود الملف في مجلد المشروع
    if (!fs.existsSync(filePath)) {
        console.log(`[تنبيه] الملف غير موجود: ${endpointName}`);
        return res.status(404).json({ code: -1, msg: `File ${endpointName} not found` });
    }
    
    console.log(`طلب وارد -> قراءة الملف: ${endpointName}`);
    
    fs.readFile(filePath, 'utf8', (err, rawData) => {
        if (err) {
            console.error(`خطأ في قراءة الملف ${endpointName}:`, err);
            return res.status(500).json({ code: -1, msg: "Read file error" });
        }
        
        // استخراج محتوى الـ JSON فقط وتجاهل الهيدرات النصية العلوية إن وجدت
        const lines = rawData.split(/\r?\n/);
        let bodyStartIndex = 0;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('{') || lines[i].trim().startsWith('[')) {
                bodyStartIndex = i;
                break;
            }
        }
        
        const jsonBody = lines.slice(bodyStartIndex).join('\n');
        
        // ضبط الهيدرات الصارمة لمنع التخزين المؤقت وتوافق التطبيق
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        
        return res.status(200).send(jsonBody);
    });
});

// مسار إضافي خاص بجذر الروابط إذا طلبها التطبيق بدون parameters
app.get('/api/v2/urls', (req, res) => {
    const filePath = path.join(__dirname, 'urls?config_no=0&app_id=3');
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.send(data);
        });
    } else {
        res.status(404).json({ code: -1 });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
