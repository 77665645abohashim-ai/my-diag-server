return res.json({
    code: 0,                   // تم التغيير من 200 إلى 0
    msg: "success",
    message: "success",
    ret: 0,                    // تم التغيير من 200 إلى 0
    status: 1,
    success: true,
    data: {
        status: 1,
        authorized: true,
        login_key: loginKey,
        serialNo: loginKey,
        token: "9f8e7d6c5b4a3210123456789abcdef0", // توكين بصيغة مألوفة للتطبيق
        userId: "10088",
        userName: loginKey,
        expireTime: "2099-12-31 23:59:59",
        is_active: 1,
        serverTime: Date.now()
    }
});
