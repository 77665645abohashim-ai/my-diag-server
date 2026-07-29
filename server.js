app.post('/api/v2/url-upload', (req, res) => {
    const baseUrl = "https://my-diag-server.onrender.com";
    const requestedAction = req.body?.url || '';

    let targetUrl = baseUrl;

    // توجيه الطلب بناءً على الإجراء المطلوب
    if (requestedAction === 'login') {
        targetUrl = `${baseUrl}/api/login`;
    }

    let time = new Date().toLocaleString();
    if (typeof requestLogs !== 'undefined') {
        requestLogs.unshift({
            time: time,
            serial: req.body?.serialNo || 'System',
            status: 'مقبولة',
            response: `طلب عنوان خدمة: ${requestedAction} -> ${targetUrl}`
        });
    }

    return res.json({
        code: 0,
        msg: "success",
        data: {
            url: targetUrl,
            action: requestedAction,
            status: 1
        }
    });
});
