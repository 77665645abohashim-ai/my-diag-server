const fs = require('fs');
const path = require('path');

// مسار مجلد الردود
const responsesDir = path.join(__dirname, 'responses');

// التأكد من أن المجلد موجود، وإذا لم يكن موجوداً يتم إنشاؤه تلقائياً
if (!fs.existsSync(responsesDir)) {
    fs.mkdirSync(responsesDir);
    console.log("📁 Created 'responses' directory successfully.");
}

// إنشاء ملف login.json افتراضي إذا لم يكن موجوداً
const loginPath = path.join(responsesDir, 'login.json');
if (!fs.existsSync(loginPath)) {
    fs.writeFileSync(loginPath, JSON.stringify({
        "code": 0,
        "msg": "success",
        "data": {
            "token": "YmxrVCtaaEVJNWUrWWhhcVY5VHIvdz09",
            "user_id": "10001",
            "username": "DiagZoneVIP"
        }
    }, null, 2));
}

// إنشاء ملف urls.json افتراضي إذا لم يكن موجوداً
const urlsPath = path.join(responsesDir, 'urls.json');
if (!fs.existsSync(urlsPath)) {
    fs.writeFileSync(urlsPath, JSON.stringify({
        "code": 0,
        "msg": "success",
        "version": "74",
        "area": "2",
        "data": {
            "urls": [
                { "key": "login", "value": "https://my-diag-server.onrender.com/api/v2/login" },
                { "key": "publicsoftservice.*", "value": "https://my-diag-server.onrender.com/api/v2/publicsoftservice" }
            ]
        }
    }, null, 2));
}

// إنشاء ملف softwares.json افتراضي إذا لم يكن موجوداً
const softwaresPath = path.join(responsesDir, 'softwares.json');
if (!fs.existsSync(softwaresPath)) {
    fs.writeFileSync(softwaresPath, JSON.stringify({
        "softwares": [
            {
                "softId": 1015,
                "softName": "Diagzone PRO V2",
                "softPackageID": "Diagzone_PRO_V2",
                "versionNo": "V2.00.033",
                "versionDetailId": 359645,
                "fileSize": 68365802,
                "lanId": "EN",
                "serverCurrentTime": "2026-08-06",
                "softUpdateTime": "2025-03-08 00:00:00",
                "fileName": "DiagPro_V2.apk"
            }
        ]
    }, null, 2));
}
