const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل استقبال البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // لدعم إرسال البيانات من أزرار المتصفح

// قائمة السيريالات المصرح لها (تبدأ بسيريال افتراضي)
let authorizedSerials = ["123456"];

// مخزن الإحصائيات وسجلات العمليات
let stats = {
    totalChecks: 0,
    successfulChecks: 0,
    failedChecks: 0
};
let diagnosticLogs = [];

// 1. المسار الرئيسي (GET /) - يعرض لوحة التحكم التفاعلية مع الأزرار والمدخلات
app.get('/', (req, res) => {
    // تجهيز أسطر جدول السيريالات المسموحة مع زر الحذف لكل سيريال
    const serialRows = authorizedSerials.map(s => `
        <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #fff;">${s}</td>
            <td style="padding: 10px; text-align: left;">
                <form method="POST" action="/api/delete-serial" style="margin:0;">
                    <input type="hidden" name="serial" value="${s}">
                    <button type="submit" style="background-color: #b71c1c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">حذف ✗</button>
                </form>
            </td>
        </tr>
    `).join('');

    // تجهيز أسطر سجل العمليات الحي
    const logRows = diagnosticLogs.map(log => `
        <tr style="border-bottom: 1px solid #444;">
            <td style="padding: 12px; color: #aaa; font-size: 13px;">${log.time}</td>
            <td style="padding: 12px; font-weight: bold; color: #fff; font-family: monospace;">${log.serial}</td>
            <td style="padding: 12px;">
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                    background-color: ${log.status === 'success' ? '#1b5e20' : '#b71c1c'}; 
                    color: ${log.status === 'success' ? '#4caf50' : '#f44336'};">
                    ${log.status === 'success' ? 'مقبول ✓' : 'مرفوض ✗'}
                </span>
            </td>
            <td style="padding: 12px; color: #ddd; font-size: 13px;">${log.message}</td>
        </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>لوحة التحكم التفاعلية لـ Diag Server</title>
        <style>
            body { font-family: sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 15px; }
            .container { max-width: 900px; margin: 0 auto; }
            h1 { text-align: center; color: #2196f3; margin-bottom: 25px; }
            .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-gap: 15px; margin-bottom: 25px; }
            .card { background-color: #1e1e1e; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border-top: 4px solid #2196f3; }
            .card.success { border-top-color: #4caf50; }
            .card.fail { border-top-color: #f44336; }
            .card h3 { margin: 0 0 10px 0; color: #888; font-size: 14px; }
            .card .value { font-size: 28px; font-weight: bold; color: #fff; }
            
            .section { background-color: #1e1e1e; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); margin-bottom: 25px; }
            h2 { color: #2196f3; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px; font-size: 18px; }
            
            /* تصميم أزرار وحقول الإدخال */
            input[type="text"] { background-color: #2b2b2b; color: white; border: 1px solid #444; padding: 10px; border-radius: 4px; width: 70%; max-width: 300px; box-sizing: border-box; }
            button.btn-add { background-color: #2196f3; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; }
            button.btn-add:hover { background-color: #1976d2; }
            
            table { width: 100%; border-collapse: collapse; text-align: right; }
            th { padding: 10px; color: #2196f3; border-bottom: 2px solid #333; font-size: 14px; }
            .no-data { text-align: center; color: #666; padding: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📊 لوحة التحكم وإدارة السيريالات</h1>
            
            <div class="dashboard-grid">
                <div class="card"><h3>إجمالي العمليات</h3><div class="value">${stats.totalChecks}</div></div>
                <div class="card success"><h3>مقبولة</h3><div class="value" style="color: #4caf50;">${stats.successfulChecks}</div></div>
                <div class="card fail"><h3>مرفوضة</h3><div class="value" style="color: #f44336;">${stats.failedChecks}</div></div>
            </div>

            <div class="section">
                <h2>➕ إضافة سيريال مصرح له جديد</h2>
                <form method="POST" action="/api/add-serial" style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" name="serial" placeholder="أدخل رقم السيريال هنا..." required>
                    <button type="submit" class="btn-add">إضافة وتفعيل</button>
                </form>
                
                <h3 style="color: #888; font-size: 15px; margin-top: 20px;">السيريالات المفعلة حالياً:</h3>
                <table>
                    <thead><tr><th>رقم السيريال</th><th style="text-align:left;">الإجراء</th></tr></thead>
                    <tbody>
                        ${serialRows.length > 0 ? serialRows : '<tr><td colspan="2" class="no-data">لا توجد سيريالات مضافة. السيرفر سيرفض الجميع حالياً.</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>📈 سجل طلبات الفحص الحية (تحديث يدوي عند إنعاش الصفحة)</h2>
                <table>
                    <thead>
                        <tr><th>التوقيت</th><th>السيريال المعالج</th><th>الحالة</th><th>استجابة النظام</th></tr>
                    </thead>
                    <tbody>
                        ${logRows.length > 0 ? logRows : '<tr><td colspan="4" class="no-data">لا توجد عمليات فحص واردة من التطبيق حتى الآن.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(htmlContent);
});

// 2. مسار إضافة سيريال عبر أزرار الواجهة
app.post('/api/add-serial', (req, res) => {
    const { serial } = req.body;
    if (serial && !authorizedSerials.includes(serial.trim())) {
        authorizedSerials.push(serial.trim());
    }
    res.redirect('/'); // إعادة توجيه لتحديث الصفحة فوراً
});

// 3. مسار حذف سيريال عبر أزرار الواجهة
app.post('/api/delete-serial', (req, res) => {
    const { serial } = req.body;
    authorizedSerials = authorizedSerials.filter(s => s !== serial);
    res.redirect('/');
});

// 4. مسار فحص السيريال الخاص بالتطبيق (POST /api/check-serial)
app.post('/api/check-serial', (req, res) => {
    const { serial } = req.body;
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Aden', hour12: true });
    stats.totalChecks++;

    if (!serial) {
        stats.failedChecks++;
        diagnosticLogs.unshift({ time: currentTime, serial: 'فارغ', status: 'failed', message: 'طلب مرفوض: السيريال مفقود.' });
        return res.status(400).json({ status: "failed", isAuthorized: false, message: "Serial missing" });
    }

    const trimmedSerial = serial.trim();

    // فحص صلاحية السيريال: يقبل إذا كان مضافاً في القائمة، أو يبدأ بـ DIAG تلقائياً
    if (authorizedSerials.includes(trimmedSerial) || trimmedSerial.toUpperCase().startsWith('DIAG')) {
        stats.successfulChecks++;
        diagnosticLogs.unshift({ time: currentTime, serial: trimmedSerial, status: 'success', message: 'تم التحقق بنجاح وتصريح الجهاز.' });
        return res.json({ status: "success", isAuthorized: true, message: "Device authorized successfully" });
    } else {
        stats.failedChecks++;
        diagnosticLogs.unshift({ time: currentTime, serial: trimmedSerial, status: 'failed', message: 'سيريال غير مدرج بقاعدة البيانات أو منتهي.' });
        return res.json({ status: "failed", isAuthorized: false, message: "Unauthorized device serial" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
