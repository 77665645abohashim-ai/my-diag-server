const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسار رئيسي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.json({ status: 'Server is running successfully', time: new Date() });
});

// مسار التحميل المعدل (توجيه مباشر سريع إلى GitHub)
app.get('/api/v2/download', (req, res) => {
    const versionDetailId = req.query.versionDetailId;
    const dzCode = req.query.dzCode;

    console.log(`طلب تحميل جديد - versionDetailId: ${versionDetailId}, dzCode: ${dzCode}`);

    const filePath = path.join(__dirname, 'download');

    if (!fs.existsSync(filePath)) {
        console.error('ملف البيانات غير موجود على السيرفر');
        return res.status(404).json({ code: 1, msg: 'download file not found on server', data: null });
    }

    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const downloadData = JSON.parse(rawData);

        if (!versionDetailId || !downloadData[versionDetailId]) {
            console.error(`رقم الإصدار غير موجود: ${versionDetailId}`);
            return res.status(404).json({ code: 1, msg: `Version ID ${versionDetailId} not found`, data: null });
        }

        const item = downloadData[versionDetailId];
        const targetUrl = typeof item === 'string' ? item : item.downloadUrl;

        if (!targetUrl) {
            return res.status(404).json({ code: 1, msg: 'Download URL is missing', data: null });
        }

        console.log(`إعادة توجيه فورية (Redirect) إلى رابط GitHub: ${targetUrl}`);

        // إعادة توجيه التطبيق مباشرة إلى رابط GitHub لتحميل الملف بأقصى سرعة
        return res.redirect(302, targetUrl);

    } catch (err) {
        console.error('خطأ أثناء قراءة ملف الـ JSON أو معالجة التوجيه:', err.message);
        if (!res.headersSent) {
            return res.status(500).json({ code: 1, msg: 'Server error processing download', data: null });
        }
    }
});

// مسارات أخرى لدعم التطبيق إذا كانت مطلوبة (مثل جلب قائمة الإصدارات أو التفاصيل)
app.get('/api/v2/get_updates', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'download');
        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const downloadData = JSON.parse(rawData);
            return res.json({ code: 0, msg: 'success', data: downloadData });
        }
        return res.status(404).json({ code: 1, msg: 'Data not found', data: null });
    } catch (e) {
        return res.status(500).json({ code: 1, msg: e.message, data: null });
    }
});

app.listen(PORT, () => {
    console.log(`السيرفر يعمل الآن على البورت ${PORT}`);
});
