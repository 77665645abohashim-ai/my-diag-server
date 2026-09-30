const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// دعم استقبال بيانات الفورم (url-encoded)
app.use(express.urlencoded({ extended: true }));
// دعم استقبال بيانات الـ XML لطلبات الـ SOAP
app.use(express.text({ type: ['text/xml', 'application/xml'] }));

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

// مسار التحميل (Download) المعدل ليطابق versionDetailId مع ملف الـ JSON
app.get('/api/v2/download', (req, res) => {
    const versionDetailId = req.query.versionDetailId;
    const dzCode = req.query.dzCode;

    console.log(`تم استلام طلب التحميل (Download) - versionDetailId: ${versionDetailId}, dzCode: ${dzCode}`);

    const filePath = path.join(__dirname, 'download');

    if (fs.existsSync(filePath)) {
        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const downloadData = JSON.parse(rawData);

            // التحقق مما إذا كان versionDetailId موجوداً داخل كائن الـ JSON
            if (versionDetailId && downloadData[versionDetailId]) {
                console.log(`تم العثور على بيانات التحميل للـ ID: ${versionDetailId}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json(downloadData[versionDetailId]);
            } else {
                console.log(`لم يتم العثور على ID: ${versionDetailId} في ملف download`);
                return res.status(404).json({
                    code: 1,
                    msg: `Version ID ${versionDetailId} not found`,
                    data: null
                });
            }
        } catch (err) {
            console.error('خطأ في تحليل ملف download كـ JSON:', err);
            // إرسال الملف كاملاً كخيار احتياطي في حال فشل القراءة كـ JSON
            res.setHeader('Content-Type', 'application/json');
            return res.sendFile(filePath);
        }
    } else {
        res.status(404).json({
            code: 1,
            msg: 'download file not found on server',
            data: null
        });
    }
});

// مسار تسجيل الدخول (Login)
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

// مسار رفع الروابط (url-upload)
app.post('/api/v2/url-upload', (req, res) => {
    console.log('تم استلام طلب الـ url-upload');

    const filePath = path.join(__dirname, 'url-upload');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } else {
        res.status(404).json({
            code: 1,
            msg: 'url-upload file not found on server',
            data: null
        });
    }
});

// مسار الـ publicsoftservice (SOAP/XML)
app.post('/api/v2/publicsoftservice', (req, res) => {
    console.log('تم استلام طلب publicsoftservice (SOAP)');

    const filePath = path.join(__dirname, 'publicsoftservice');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.sendFile(filePath);
    } else {
        res.status(404).send(`
            <v:Envelope xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                <v:Body>
                    <v:Fault>
                        <faultcode>Server</faultcode>
                        <faultstring>publicsoftservice file not found on server</faultstring>
                    </v:Fault>
                </v:Body>
            </v:Envelope>
        `);
    }
});

// مسار الـ publicsoftservice-nt (SOAP/XML)
app.post('/api/v2/publicsoftservice-nt', (req, res) => {
    console.log('تم استلام طلب publicsoftservice-nt (SOAP)');

    const filePath = path.join(__dirname, 'publicsoftservice-nt');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.sendFile(filePath);
    } else {
        res.status(404).send(`
            <v:Envelope xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                <v:Body>
                    <v:Fault>
                        <faultcode>Server</faultcode>
                        <faultstring>publicsoftservice-nt file not found on server</faultstring>
                    </v:Fault>
                </v:Body>
            </v:Envelope>
        `);
    }
});

// مسار الـ product-service (SOAP/XML)
app.post('/api/v2/product-service', (req, res) => {
    console.log('تم استلام طلب product-service (SOAP)');

    const filePath = path.join(__dirname, 'product-service');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.sendFile(filePath);
    } else {
        res.status(404).send(`
            <v:Envelope xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                <v:Body>
                    <v:Fault>
                        <faultcode>Server</faultcode>
                        <faultstring>product-service file not found on server</faultstring>
                    </v:Fault>
                </v:Body>
            </v:Envelope>
        `);
    }
});

// مسار الـ diagnosticLog (SOAP/XML)
app.post('/api/v2/diagnosticLog', (req, res) => {
    console.log('تم استلام طلب diagnosticLog (SOAP)');

    const filePath = path.join(__dirname, 'diagnosticLog');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.sendFile(filePath);
    } else {
        res.status(404).send(`
            <v:Envelope xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                <v:Body>
                    <v:Fault>
                        <faultcode>Server</faultcode>
                        <faultstring>diagnosticLog file not found on server</faultstring>
                    </v:Fault>
                </v:Body>
            </v:Envelope>
        `);
    }
});

// مسار الـ statistics
app.post('/api/v2/statistics', (req, res) => {
    console.log('تم استلام طلب statistics');

    const filePath = path.join(__dirname, 'statistics');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } else {
        res.status(404).json({
            code: 1,
            msg: 'statistics file not found on server',
            data: null
        });
    }
});

// مسار الـ diagsoftservice
app.post('/api/v2/diagsoftservice', (req, res) => {
    const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');
    let targetFileName = 'diagsoftservice1'; // افتراضي

    if (requestBody.includes('queryLatestDiagSofts')) {
        console.log('تم استلام طلب diagsoftservice -> [queryLatestDiagSofts] سيتم قراءة الملف: diagsoftservice1');
        targetFileName = 'diagsoftservice1';
    } else if (requestBody.includes('queryPDTDiagSoftSubPack')) {
        console.log('تم استلام طلب diagsoftservice -> [queryPDTDiagSoftSubPack] سيتم قراءة الملف: diagsoftservice2');
        targetFileName = 'diagsoftservice2';
    } else {
        console.log('تم استلام طلب diagsoftservice -> نوع غير معروف، استخدام الملف الافتراضي: diagsoftservice1');
    }

    const filePath = path.join(__dirname, targetFileName);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.sendFile(filePath);
    } else {
        res.status(404).send(`
            <v:Envelope xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                <v:Body>
                    <v:Fault>
                        <faultcode>Server</faultcode>
                        <faultstring>${targetFileName} file not found on server</faultstring>
                    </v:Fault>
                </v:Body>
            </v:Envelope>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
