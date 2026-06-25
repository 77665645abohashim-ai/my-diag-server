const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// قاعدة بيانات تجريبية تحتوي على أرقام تسلسلية وحالتها
let devices = {
    "123456789012": { status: "active", expiryDate: "2027-12-31", package: "Full Cars" },
    "987654321098": { status: "expired", expiryDate: "2025-01-01", package: "Trucks" }
};

// مسار عرض الواجهة المتطورة من ملف منفصل
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// رابط فحص وتدقيق السيريال للتطبيق
app.post('/api/check-serial', (req, res) => {
    const { serial } = req.body;
    const device = devices[serial];

    if (!device) {
        return res.status(404).json({ success: false, message: "الرقم التسلسلي غير موجود بالمنظومة!" });
    }

    res.json({ success: true, data: device });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
