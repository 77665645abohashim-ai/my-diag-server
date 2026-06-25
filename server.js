const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// قاعدة بيانات تجريبية تحتوي على أرقام تسلسلية وحالتها
let devices = {
    "123456789012": { status: "active", expiryDate: "2027-12-31", package: "Full Cars" },
    "987654321098": { status: "expired", expiryDate: "2025-01-01", package: "Trucks" }
};

// واجهة السيرفر الترحيبية المتطورة (اللوحة الاحترافية الداكنة)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة تحكم سيرفر التشخيص</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-900 text-gray-100 font-sans antialiased">

    <nav class="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-3 space-x-reverse">
            <i class="fa-solid fa-server text-emerald-500 text-2xl"></i>
            <span class="text-xl font-bold tracking-wide text-white">Diagnostic System Pro</span>
        </div>
        <div class="flex items-center gap-2">
            <span class="flex h-3 w-3 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span class="text-sm text-emerald-400 font-medium">السيرفر يعمل بنجاح</span>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        <div class="bg-gradient-to-r from-gray-800 to-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h1 class="text-2xl font-bold text-white mb-2">مرحباً بك في لوحة التحكم الذكية</h1>
            <p class="text-gray-400 text-sm">نظام إدارة السيرياللات، تفعيل البرمجيات، ومراقبة طلبات فحص وتشخيص المركبات عن بُعد.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400 font-medium">السيرياللات المسجلة</p>
                    <p class="text-3xl font-bold text-white mt-1">2</p>
                </div>
                <div class="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <i class="fa-solid fa-key text-xl"></i>
                </div>
            </div>

            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400 font-medium">الأجهزة المفعلة</p>
                    <p class="text-3xl font-bold text-emerald-400 mt-1">1</p>
                </div>
                <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <i class="fa-solid fa-mobile-screen text-xl"></i>
                </div>
            </div>

            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400 font-medium">الاشتراكات المنتهية</p>
                    <p class="text-3xl font-bold text-rose-400 mt-1">1</p>
                </div>
                <div class="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                    <i class="fa-solid fa-ban text-xl"></i>
                </div>
            </div>

        </div>

        <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
            <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 class="font-bold text-lg text-white flex items-center gap-2">
                    <i class="fa-solid fa-list-check text-emerald-500"></i>
                    السيرياللات المسجلة بالنظام وحالتها الحالية
                </h2>
                <span class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-md font-mono">قاعدة البيانات</span>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-right text-sm">
                    <thead class="bg-gray-700/50 text-gray-300 text-xs uppercase tracking-wider">
                        <tr>
                            <th class="px-6 py-3">رقم السيريال / الجهاز</th>
                            <th class="px-6 py-3">الحزمة البرمجية</th>
                            <th class="px-6 py-3">تاريخ الانتهاء</th>
                            <th class="px-6 py-3">حالة الحساب</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-700 text-gray-300">
                        <tr class="hover:bg-gray-700/30 transition-colors">
                            <td class="px-6 py-4 font-mono font-medium text-white">123456789012</td>
                            <td class="px-6 py-4">Full Cars (سيارات كامل)</td>
                            <td class="px-6 py-4 font-mono text-xs">2027-12-31</td>
                            <td class="px-6 py-4"><span class="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">نشط (Active)</span></td>
                        </tr>
                        <tr class="hover:bg-gray-700/30 transition-colors">
                            <td class="px-6 py-4 font-mono font-medium text-white">987654321098</td>
                            <td class="px-6 py-4">Trucks (شاحنات)</td>
                            <td class="px-6 py-4 font-mono text-xs">2025-01-01</td>
                            <td class="px-6 py-4"><span class="px-2 py-0.5 text-xs font-medium bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">منتهي (Expired)</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </main>

</body>
</html>
    `);
});

// رابط فحص وتدقيق السيريال المستخدم من قبل التطبيق الخارجي
app.post('/api/check-serial', (req, res) => {
    const { serial } = req.body;
    const device = devices[serial];

    if (!device) {
        return res.status(404).json({ success: false, message: "الرقم التسلسلي غير موجود بالمنظومة!" });
    }

    res.json({ success: true, data: device });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
