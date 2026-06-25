const express = require('express');
const app = express();
app.use(express.json());

// قاعدة بيانات تجريبية تحتوي على أرقام تسلسلية وحالتها
let devices = {
    "123456789012": { status: "active", expiryDate: "2027-12-31", package: "Full Cars" },
    "987654321098": { status: "expired", expiryDate: "2025-01-01", package: "Trucks" }
};

// واجهة السيرفر الترحيبية
app.get('/', (req, res) => {
    res.send('<h1>سيرفر السيريالات والتشخيص يعمل بنجاح!</h1>');
});

// رابط فحص وتدقيق السيريال
app.post('/api/check-serial', (req, res) => {
    const { serial } = req.body;
    const device = devices[serial];

    if (!device) {
        return res.status(404).json({ success: false, message: "الرقم التسلسلي غير موجود بالمنظومة!" });
    }

    const today = new Date();
    const expiry = new Date(device.expiryDate);

    if (today > expiry || device.status !== "active") {
        return res.json({ success: false, message: "الاشتراك منتهي الصلاحية أو محظور", expired: true });
    }

    res.json({
        success: true,
        message: "الاشتراك فعال ومصرح له بالاستخدام",
        package: device.package,
        expiryDate: device.expiryDate
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`السيرفر يعمل`));

