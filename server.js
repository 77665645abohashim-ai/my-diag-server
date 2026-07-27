app.use((req, res, next) => {
    if (req.headers['user-agent']?.includes('okhttp') || req.path !== '/') {
        // التقاط السيريال من serialNo أو من أي خانة متاحة، وإذا كانت فارغة نستخدم السيريال الافتراضي
        let loginKey = req.body.serialNo || req.body.username || req.body.login_key || req.query.serialNo || '979862374489';
        let time = new Date().toLocaleString();

        requestLogs.unshift({
            time: time,
            serial: loginKey,
            status: 'مقبولة',
            response: `Path: ${req.path} - تجاوز فحص تسجيل الدخول بنجاح`
        });

        return res.json({
            code: 200,
            msg: "success",
            message: "success",
            ret: 200,
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
