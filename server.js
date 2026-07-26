const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let allowedSerials = ['123456', '979862374489'];
let requestLogs = [];

// 1. معالجة طلبات التطبيق (GET أو POST) التي ليست لصفحة لوحة التحكم
app.use((req, res, next) => {
    // إذا كان الطلب قادماً من التطبيق (يعمل بـ okhttp أو ليس متصفح ويب عادي يطلب الصفحة الرئيسية)
    if (req.headers['user-agent']?.includes('okhttp') || req.query.config_no !== undefined || req.path !== '/') {
        let serialNo = req.body.serialNo || req.body.serial || req.query.serial || 'غير متوفر';
        let time = new Date().toLocaleString();

        let isAuthorized = allowedSerials.includes(serialNo);
        let statusText = isAuthorized ? 'مقبولة' : 'مرفوضة';

        // تسجيل الطلب في السجل الحي
        requestLogs.unshift({
            time: time,
            serial: serialNo,
            status: statusText,
            response: `Path: ${req.path} - ${isAuthorized ? 'صرح به' : 'غير مصرح'}`
        });

        return res.json({
            code: 200,
            message: "success",
            data: {
                status: isAuthorized ? 1 : 0,
                authorized: isAuthorized,
                serverTime: Date.now()
            }
        });
    }
    next();
});

// 2. لوحة التحكم الرئيسية (تظهر فقط عند فتح الرابط من المتصفح)
app.get('/', (req, res) => {
    let total = requestLogs.length;
    let successCount = requestLogs.filter(l => l.status === 'مقبولة').length;
    let failCount = requestLogs.filter(l => l.status === 'مرفوضة').length;

    let html = `
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
                <div class="card"><h3>إجمالي العمليات</h3><div class="value">${total}</div></div>
                <div class="card success"><h3>مقبولة</h3><div class="value" style="color: #4caf50;">${successCount}</div></div>
                <div class="card fail"><h3>مرفوضة</h3><div class="value" style="color: #f44336;">${failCount}</div></div>
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
                        ${allowedSerials.map(s => `
                            <tr style="border-bottom: 1px solid #333;">
                                <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #fff;">${s}</td>
                                <td style="padding: 10px; text-align: left;">
                                    <form method="POST" action="/api/delete-serial" style="margin:0;">
                                        <input type="hidden" name="serial" value="${s}">
                                        <button type="submit" style="background-color: #b71c1c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">حذف ✗</button>
                                    </form>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="section">
                <h2>📈 سجل طلبات الفحص الحية</h2>
                <table>
                    <thead>
                        <tr><th>التوقيت</th><th>السيريال المعالج</th><th>الحالة</th><th>استجابة النظام</th></tr>
                    </thead>
                    <tbody>
                        ${requestLogs.length === 0 ? '<tr><td colspan="4" class="no-data">لا توجد عمليات فحص واردة من التطبيق حتى الآن.</td></tr>' :
                          requestLogs.map(log => `
                            <tr style="border-bottom: 1px solid #333;">
                                <td style="padding: 10px; font-size: 12px; color: #aaa;">${log.time}</td>
                                <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #fff;">${log.serial}</td>
                                <td style="padding: 10px; color: ${log.status === 'مقبولة' ? '#4caf50' : '#f44336'};">${log.status}</td>
                                <td style="padding: 10px; font-size: 12px; color: #ccc;">${log.response}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>`;
    res.send(html);
});

// 3. مسارات إدارة السيريالات
app.post('/api/add-serial', (req, res) => {
    let newSerial = req.body.serial;
    if (newSerial && !allowedSerials.includes(newSerial)) {
        allowedSerials.push(newSerial.trim());
    }
    res.redirect('/');
});

app.post('/api/delete-serial', (req, res) => {
    let targetSerial = req.body.serial;
    allowedSerials = allowedSerials.filter(s => s !== targetSerial);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
