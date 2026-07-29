app.use((req, res, next) => {
    // التأكد أن الطلب قادم من التطبيق أو يخص الـ API
    const isAppRequest = req.headers['user-agent']?.includes('okhttp') || 
                         req.path.includes('login') || 
                         req.path.includes('auth') || 
                         req.path.startsWith('/api');

    if (isAppRequest && req.method === 'POST') {
        // قراءة الرقم التسلسلي القادم من التطبيق إن وجد، أو استخدام الافتراضي
        let loginKey = req.body?.serialNo || req.body?.serialno || '979862374489';
        let time = new Date().toLocaleString();

        // تسجيل الطلب في القائمة
        requestLogs.unshift({
            time: time,
            serial: loginKey,
            status: 'مقبولة',
            response: `Path: ${req.path} - Action: ${req.body?.url || 'N/A'}`
        });

        // إرجاع استجابة شاملة لجميع الحقول المتوقعة من التطبيق
        return res.json({
            code: 0, // ملاحظة: معظم تطبيقات Launch/Diagzone تتوقع code: 0 للنجاح بدلاً من 200
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

    // إذا كان الطلب استعراض لوحة تحكم أو صفحة أخرى يكمل طبيعي
    next();
});
