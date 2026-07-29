app.use((req, res, next) => {
    // 1. استثناء طلبات المتصفح للوحات التحكم والأيقونات فوراً
    if (req.path === '/favicon.ico' || req.path === '/' || req.path.includes('/dashboard')) {
        return next(); // يخليه يمر طبيعي بدون تسجيل أو إرجاع JSON
    }

    // 2. التحقق من أن الطلب قادم بالفعل من التطبيق (OkHttp أو طلبات الـ POST للـ API)
    const isAppRequest = req.headers['user-agent']?.includes('okhttp') || 
                         req.path.includes('login') || 
                         req.path.includes('auth') || 
                         (req.method === 'POST' && req.body?.url);

    if (isAppRequest) {
        // قراءة الرقم التسلسلي القادم في الطلب، وإن لم يوجد نأخذ الافتراضي
        let loginKey = req.body?.serialNo || req.body?.serialno || '979862374489';
        let time = new Date().toLocaleString();

        // إضافة الطلب للسجل (الآن سيسجل فقط طلبات التطبيق الحقيقية)
        requestLogs.unshift({
            time: time,
            serial: loginKey,
            status: 'مقبولة',
            response: `Path: ${req.path} | Action: ${req.body?.url || 'Direct POST'}`
        });

        // إرجاع الاستجابة للتطبيق
        return res.json({
            code: 0, // تم التعديل إلى 0 لضمان توافق Diagzone/Launch
            msg: "success",
            message: "success",
            ret: 0,
            status: 1,
            success: true,
            data: {
                status: 1,
                authorized: true,
                login_key: loginKey,
                serialNo: loginKey,
                token: "Bearer_Original_Bypassed_Token",
                userId: "10088",
                userName: loginKey,
                expireTime: "2099-12-31 23:59:59",
                is_active: 1,
                serverTime: Date.now()
            }
        });
    }

    next();
});
