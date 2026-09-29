const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running!' });
});

// المسار الذي يطلبه التطبيق للروابط
app.get('/api/v2/urls', (req, res) => {
    const configNo = req.query.config_no;
    const appId = req.query.app_id;

    console.log(`طلب الروابط - config_no: ${configNo}, app_id: ${appId}`);

    let filePath = path.join(__dirname, 'urls?config_no=0&app_id=3');
    
    if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'softwares.json');
    }
    if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'urls');
    }

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } else {
        res.status(404).json({
            code: 1,
            msg: 'File not found on server',
            data: null
        });
    }
});

// مسار تسجيل الدخول (Login) الجديد
app.post('/api/v2/login', (req, res) => {
    console.log('تم استلام طلب تسجيل الدخول (Login)');

    const filePath = path.join(__dirname, 'login');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } else {
        res.status(404).json({
            code: 1,
            msg: 'Login file not found on server',
            data: null
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
