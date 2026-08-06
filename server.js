const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));

// مجلد الملفات والبرمجيات للتحميل
app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.use('/api/v2/download', express.static(path.join(__dirname, 'public/files')));

const MY_SERVER_URL = process.env.SERVER_URL || "https://my-diag-server.onrender.com";

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
    next();
});

// 1. مسار البرمجيات والماركات (XML) يعتمد على softwares.json
app.all([
    '/api/v2/publicsoftservice-nt', 
    '/publicsoftservice-nt', 
    '/publicsoftservice',
    '/api/v2/publicsoftservice',
    '/api/v2/diagsoftservice',
    '/diagsoftservice',
    '/api/v2/x431paddiagsoftservice',
    '/x431paddiagsoftservice'
], (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    
    let softListXml = '';
    try {
        const filePath = path.join(__dirname, 'responses', 'softwares.json');
        if (fs.existsSync(filePath)) {
            const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (db && db.softwares) {
                db.softwares.forEach(soft => {
                    softListXml += `
                    <x431PadSoft>
                        <fileSize>${soft.fileSize}</fileSize>
                        <lanId>${soft.lanId}</lanId>
                        <serverCurrentTime>${soft.serverCurrentTime}</serverCurrentTime>
                        <softId>${soft.softId}</softId>
                        <softName>${soft.softName}</softName>
                        <softPackageID>${soft.softPackageID}</softPackageID>
                        <softUpdateTime>${soft.softUpdateTime}</softUpdateTime>
                        <versionDetailId>${soft.versionDetailId}</versionDetailId>
                        <versionNo>${soft.versionNo}</versionNo>
                        <url>${MY_SERVER_URL}/files/${soft.fileName}</url>
                    </x431PadSoft>`;
                });
            }
        }
    } catch (error) {
        console.error("Error reading softwares.json:", error);
    }

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryLatestPublicSoftsResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <x431PadSoftList>
                    ${softListXml}
                </x431PadSoftList>
            </return>
        </ns1:queryLatestPublicSoftsResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    return res.status(200).send(xmlResponse);
});

// 2. نظام ديناميكي ذكي لبقية المسارات (مثل url-upload, login, diagnosticLog, product-service)
app.all('*', (req, res) => {
    // تنظيف اسم المسار ليطابق اسم الملف في مجلد responses
    let cleanPath = req.path.replace(/^\/api\/v2\//, '').replace(/^\//, '').replace(/\//g, '_');
    if (!cleanPath) cleanPath = 'index';

    const targetFile = path.join(__dirname, 'responses', `${cleanPath}.json`);
    
    console.log(`🔍 Looking for file: responses/${cleanPath}.json`);

    if (fs.existsSync(targetFile)) {
        try {
            const fileData = fs.readFileSync(targetFile, 'utf8');
            return res.json(JSON.parse(fileData));
        } catch (e) {
            console.error(`Error parsing JSON file for ${cleanPath}:`, e);
        }
    }

    // رد نجاح افتراضي تلقائي في حال لم يُوجد ملف مخصص للمسار لكي لا يتوقف التطبيق
    return res.status(200).json({ 
        "code": 0, 
        "msg": "success", 
        "data": { "status": "ACTIVE" } 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Dynamic Path File-Server Online on Port ${PORT}`);
});
