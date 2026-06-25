const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل استقبال بيانات JSON
app.use(express.json());

// مخزن مؤقت للبيانات في الذاكرة (سيعاد ضبطه عند إعادة تشغيل السيرفر على Render)
let stats = {
    totalChecks: 0,
    successfulChecks: 0,
    failedChecks: 0
};
let diagnosticLogs = [];

// السيريال الافتراضي المقبول
const ALLOWED_SERIAL = "123456";

// 1. المسار الرئيسي (GET /) - يعرض لوحة التحكم الاحترافية والعدادات والجدول
app.get('/', (req, res) => {
    // تجهيز أسطر الجدول بناءً على السجلات الحالية
    const logRows = diagnosticLogs.map(log => `
        <tr style="border-bottom: 1px solid #444;">
            <td style="padding: 12px; color: #aaa;">${log.time}</td>
            <td style="padding: 12px; font-weight: bold; color: #fff;">${log.serial}</td>
            <td style="padding: 12px;">
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                    background-color: ${log.status === 'success' ? '#1b5e20' : '#b71c1c'}; 
                    color: ${log.status === 'success' ? '#4caf50' : '#f44336'};">
                    ${log.status === 'success' ? 'ناجح' : 'فاشل'}
                </span>
            </td>
            <td style="padding: 12px; color: #ddd;">${log.message}</td>
        </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>نظام التشخيص الذكي - لوحة التحكم</title>
        <style>
            body { font-family: sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 20px; }
            .container { max-width: 1000px; margin: 0 auto; }
            h1 { text-align: center; color: #2196f3; margin-bottom: 30px; }
            .dashboard-grid { display: block; margin-bottom: 30px; }
            @media(min-width: 600px) {
                .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 20px; }
            }
            .card { background-color: #1e1e1e; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border-top: 4px solid #2196f3; margin-bottom: 15px; }
            .card.success { border-top-color: #4caf50; }
            .card.fail { border-top-color: #f44336; }
            .card h3 { margin: 0 0 10px 0; color: #888; font-size: 16px; }
            .card .value { font-size: 32px; font-weight: bold; color: #fff; }
            .table-container { background-color: #1e1e1e; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); overflow-x: auto; }
            h2 { color: #2196f3; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; text-align: right; }
            th { padding: 12px; color: #2196f3; border-bottom: 2px solid #333; }
            .no-data { text-align: center; color: #666; padding: 30px; }
        </style>
        <meta http-equiv="refresh" content="10">
    </head>
    <body>
        <div class="container">
            <h1>📊 لوحة تحكم سيرفر التشخيص (Diag Server)</h1>
            
            <div class="dashboard-grid">
                <div class="card">
                    <h3>إجمالي العمليات</h3>
                    <div class="value">${stats.totalChecks}</div>
                </div>
                <div class="card success">
                    <h3>السيريلات المقبولة</h3>
                    <div class="value" style="color: #4caf50;">${stats.successfulChecks}</div>
                </div>
                <div class="card fail">
                    <h3>السيريلات المرفوضة</h3>
                    <div class="value" style="color: #f44336;">${stats.failedChecks}</div>
                </div>
            </div>

            <div class="table-container">
                <h2>📈 سجل العمليات الحي والمباشر</h2>
                <table>
                    <thead>
                        <tr>
                            <th>التوقيت</th>
                            <th>رقم السيريال المعالج</th>
                            <th>الحالة</th>
                            <th>استجابة النظام</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logRows.length > 0 ? logRows : '<tr><td colspan="4" class="no-data">لا توجد عمليات فحص مسجلة حتى الآن. كود التطبيق جاهز بانتظار الاتصال...</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(htmlContent);
});

// 2. مسار فحص السيريال للتطبيق (POST /api/check-serial)
app.post('/api/check-serial', (req, res) => {
    const { serial } = req.body;
    
    // الحصول على التوقيت المحلي الحالي في اليمن
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Aden', hour12: true });

    stats.totalChecks++;

    if (!serial) {
        stats.failedChecks++;
        diagnosticLogs.unshift({
            time: currentTime,
            serial: 'فارغ',
            status: 'failed',
            message: 'طلب مرفوض: لم يتم إرسال أي سيريال من التطبيق.'
        });
        return res.status(400).json({ status: "failed", isAuthorized: false, message: "Serial numbers missing" });
    }

    // التحقق: يقبل إذا كان يبدأ بـ "DIAG" أو السيريال الافتراضي المخصص
    if (serial.toUpperCase().startsWith('DIAG') || serial === ALLOWED_SERIAL) {
        stats.successfulChecks++;
        diagnosticLogs.unshift({
            time: currentTime,
            serial: serial,
            status: 'success',
            message: 'تم التحقق بنجاح والموافقة على تشغيل النظام وضبط الصلاحية.'
        });
        return res.json({ status: "success", isAuthorized: true, message: "Device authorized successfully" });
    } else {
        stats.failedChecks++;
        diagnosticLogs.unshift({
            time: currentTime,
            serial: serial,
            status: 'failed',
            message: 'سيريال غير مصرح به أو منتهي الصلاحية.'
        });
        return res.json({ status: "failed", isAuthorized: false, message: "Unauthorized device serial" });
    }
});

// تشغيل السيرفير
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
