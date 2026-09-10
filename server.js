const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// خريطة الروابط للتحميل (قم بتعديل أو إضافة الروابط هنا عند الحاجة)
const fileMap = {
    "4001": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP"
};

// مسار التحميل الأساسي
app.get('/api/v2/download', (req, res) => {
    const { versionDetailId, serialNo } = req.query;
    console.log(`Download request received for versionDetailId: ${versionDetailId}, Serial: ${serialNo}`);

    const fileUrl = fileMap[versionDetailId] || fileMap["4001"];

    if (!fileUrl) {
        return res.status(404).json({
            code: 404,
            message: "File not found for this versionDetailId"
        });
    }

    return res.redirect(302, fileUrl);
});

// مسار جلب قائمة الماركات والبرمجيات بقراءة ملف softwares.json محلياً
app.get('/api/v2/diagsoftservice', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'softwares.json');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "softwares.json file not found on server" });
        }

        const rawData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(rawData);
        res.json(jsonData);
    } catch (error) {
        res.status(500).json({ error: "Failed to read or parse softwares.json file" });
    }
});
app.post('/api/v2/url-upload', (req, res) => {
    console.log("URL Upload request received:", req.body);
    return res.status(200).json({
        code: 0,
        message: "OK"
    });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
