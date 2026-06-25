const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل قراءة البيانات القادمة بصيغة JSON
app.use(express.json());

// مصفوفة محلية لتخزين سجلات عمليات الفحص المؤقتة داخل الذاكرة
let diagnosticLogs = [];
let stats = {
    totalChecks: 0,
    successfulChecks: 0,
    failedChecks: 0
};

// 1. المسار الرئيسي (/) - لعرض لوحة التحكم الاحترافية والعدادات والجدول في المتصفح
app.get('/', (req, res) => {
    // إنشاء واجهة HTML متجاوبة ومريحة للعين على شاشات الهواتف
    let html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>لوحة تحكم سيرفر التشخيص والتحقق</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f6f9;
                color: #333;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 900px;
                margin: 0 auto;
            }
            h1 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 30px;
            }
            /* تصميم كروت العدادات */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                text-align: center;
                border-top: 4px solid #3498db;
            }
            .card.success { border-top-color: #2ecc71; }
            .card.failed { border-top-color: #e74c3c; }
            .card-title {
                font-size: 14px;
                color: #7f8c8d;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            .card-value {
                font-size: 28px;
                font-weight: bold;
                color: #2c3e50;
            }
            /* تصميم جدول البيانات */
            .table-container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                overflow-x: auto;
            }
            h2 {
                color: #34495e;
                margin-top: 0;
                border-bottom: 2px solid #ecf0f1;
                padding-bottom: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
                text-align: right;
            }
            th, td {
                padding: 12px 15px;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f8f9fa;
                color: #34495e;
            }
            .status-badge {
                padding: 5px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
            }
            .status-badge.success { background-color: #d4edda; color: #155724; }
            .status-badge.failed { background-color: #f8d7da; color: #721c24; }
            .no-data {
                text-align: center;
                color: #95a5a6;
                padding: 30px;
            }
        </style>
        <meta http-equiv="refresh" content="10">
    </head>
    <body>
        <div class="container">
            <h1>Diagnostic System Server 💻</h1>
            
            <div class="stats-grid">
                <div class="card">
                    <div class="card-title">إجمالي عمليات الفحص</div>
                    <div class="card-value">${stats.totalChecks}</div>
                </div>
                <div class="card success">
                    <div class="card-title">العمليات الناجحة</div>
                    <div class="card-value">${stats.successfulChecks}</div>
                </div>
                <div class="card failed">
                    <div class="card-title">العمليات المرفوضة</div>
                    <div class="card-value">${stats.failedChecks}</div>
                </div>
            </div>

            <div class="table-container">
                <h2>سجل عمليات التحقق الحية (Live Logs)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>الوقت والتاريخ</th>
                            <th>رقم السيريال (Serial)</th>
                            <th>الحالة</th>
                            <th>ملاحظات الاستجابة</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    if (diagnosticLogs.length === 0) {
        html += `<tr><td colspan="4" class="no-data">لا توجد عمليات فحص واردة حتى الآن. السيرفر في انتظار طلبات التطبيق...</td></tr>`;
    } else {
        // عرض السجلات بترتيب تنازلي (الأحدث في الأعلى)
        for (let i = diagnosticLogs.length - 1; i >= 0; i--) {
            let log = diagnosticLogs[i];
            html += `
                <tr>
                    <td>${log.time}</td>
                    <td style="font-family: monospace; font-weight: bold;">${log.serial}</td>
                    <td>
                        <span class="status-badge ${log.status === 'success' ? 'success' : 'failed'}">
                            ${log.status === 'success' ? 'مقبول ✓' : 'مرفوض ✗'}
                        </span>
                    </td>
                    <td>${log.message}</td>
                </tr>
            `;
        }
    }

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(html);
});

// 2. مسار التحقق للأجهزة (/api/check-serial) - هذا المسار الذي يرسل له التطبيق طلباته
app.post('/api/check-serial', (req, res) => {
    const { serial } = req.body;
    stats.totalChecks++;

    const currentTime = new Date().toLocaleString('ar-YE', { timeZone: 'Asia/Aden' });

    // التحقق من وجود السيريال في الطلب
    if (!serial) {
        stats.failedChecks++;
        diagnosticLogs.push({
            time: currentTime,
            serial: 'غير معروف',
            status: 'failed',
            message: 'طلب خاطئ: السيريال مفقود في حزمة البيانات'
        });
        return res.status(400).json({ status: "error", message: "Serial parameter is required" });
    }

    // هنا يمكنك وضع السيريالات المصرح لها، كمثال افتراضي نقبل أي سيريال يبدأ بـ "DIAG"
    if (serial.toUpperCase().startsWith('DIAG') || serial === '123456') {
        stats.successfulChecks++;
        diagnosticLogs.push({
            time: currentTime,
            serial: serial,
            status: 'success',
            message: 'تم التحقق بنجاح والموافقة على تشغيل النظام'
        });
        return res.json({ status: "success", isAuthorized: true, message: "Device authorized successfully" });
    } else {
        stats.failedChecks++;
        diagnosticLogs.push({
            time: currentTime,
            serial: serial,
            status: 'failed',
            message: 'سيريال غير مصرح به أو منتهي الصلاحية'
        });
        return res.json({ status: "failed", isAuthorized: false, message: "Unauthorized device serial" });
    }
});

// تشغيل خادم الاستماع
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
import 'import:flutter/material.dart';
import 'import:http/http.dart' as http;
import 'import:convert/convert.dart'; // إذا كنت تحتاج لمعالجة النصوص لاحقاً
import 'dart:convert';

class DiagnosticAuthService {
  // رابط السيرفر الخاص بك على Render والمصنع مسبقاً
  static const String _baseUrl = 'https://my-diag-server.onrender.com/api/check-serial';

  /// دالة للتحقق من السيريال نمبر الخاص بجهاز التشخيص
  static Future<Map<String, dynamic>> verifyDeviceSerial(String serialNumber) async {
    try {
      // إرسال طلب POST إلى السيرفر مع تمرير السيريال في حزمة البيانات (Body)
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Content-Type': 'application/json', // تحديد نوع البيانات المرسلة كـ JSON
        },
        body: jsonEncode({
          'serial': serialNumber,
        }),
      ).timeout(const Duration(seconds: 15)); // وضع حد أقصى للانتظار 15 ثانية (مناسب لشبكات الهاتف)

      // استقبال وتحليل استجابة السيرفر
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        
        // فحص متغير الصلاحية القادم من السيرفر (isAuthorized)
        if (responseData['isAuthorized'] == true) {
          return {
            'success': true,
            'message': responseData['message'] ?? 'تم تفعيل الجهاز بنجاح',
          };
        } else {
          return {
            'success': false,
            'message': responseData['message'] ?? 'هذا السيريال غير مصرح له بالعمل',
          };
        }
      } else if (response.statusCode == 400) {
        return {
          'success': false,
          'message': 'خطأ في الطلب: السيريال نمبر فارغ أو مفقود',
        };
      } else {
        return {
          'success': false,
          'message': 'السيرفر يواجه مشكلة حالياً، كود الخطأ: ${response.statusCode}',
        };
      }
    } async catch (e) {
      // التعامل مع أخطاء الشبكة أو انقطاع الاتصال
      return {
        'success': false,
        'message': 'تعذر الاتصال بالسيرفر، يرجى التحقق من اتصال الإنترنت في الورشة وإعادة المحاولة',
      };
    }
  }
}
void _handleActivation(BuildContext context, String serialInput) async {
  // إظهار مؤشر تحميل أثناء الاتصال بالسيرفر
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (context) => const Center(child: CircularProgressIndicator()),
  );

  // استدعاء دالة الفحص
  final result = await DiagnosticAuthService.verifyDeviceSerial(serialInput);

  // إغلاق مؤشر التحميل
  Navigator.of(context).pop();

  if (result['success'] == true) {
    // تفعيل ناجح: الانتقال إلى واجهة فحص قراءة البيانات الحية (Live Data Stream)
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(result['message']), backgroundColor: Colors.green),
    );
    
    // الانتقال لواجهة نظام التشخيص الرئيسية
    // Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => MainDiagnosticScreen()));
  } else {
    // تفعيل فاشل: إظهار رسالة الخطأ القادمة من السيرفر
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تنبيه الحماية', textDirection: TextDirection.rtl),
        content: Text(result['message'], textDirection: TextDirection.rtl),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }
}
