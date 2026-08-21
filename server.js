const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const MY_DOMAIN = 'https://my-diag-server.onrender.com';

app.use(express.text({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. مسارات التهيئة وتسجيل الدخول والروابط
app.all(['/', '/api/v2/config', '/api/v2/urls'], (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "version": "74",
        "data": {
            "urls": [
                { "key": "login", "value": `${MY_DOMAIN}/api/v2/login` },
                { "key": "check-token", "value": `${MY_DOMAIN}/api/v2/check-token` },
                { "key": "downdsfrag", "value": `${MY_DOMAIN}/api/v2/download` },
                { "key": "activation", "value": `${MY_DOMAIN}/api/v2/activation` },
                { "key": "diagsoftservice", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` }
            ]
        }
    });
});

app.all(['/api/v2/login', '/login.action'], (req, res) => {
    res.json({ "code": 0, "msg": "success", "data": { "token": "eGw0Ymhqa1BHRXdNVnJoT2tOV2pXUT09", "user": { "user_id": "H21J4WOO", "user_name": "979862374489" } } });
});

app.all('/api/v2/check-token', (req, res) => {
    res.json({ "code": 0, "msg": "success", "data": { "isValid": true } });
});

app.all('/api/v2/activation', (req, res) => {
    res.json({ "code": 0, "msg": "OK", "data": { "activationCode": "cW9VVEdobWZwdjQxNkZTeG51emRuZz09" } });
});

// 2. الاستعلام عن التحديثات (SOAP)
app.post('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
  <SOAP-ENV:Body>
    <ns1:queryLatestDiagSoftsIncrCdn>
      <return>
        <code>0</code>
        <message>success</message>
        <x431PadSoftIncrList>
          <x431PadSoftIncr>
            <fileSize>55740637</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>AR</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softId>69</softId>
            <softName>Demo</softName>
            <softPackageID>DEMO</softPackageID>
            <versionDetailId>380901</versionDetailId>
            <versionNo>V15.68</versionNo>
          </x431PadSoftIncr>
          <x431PadSoftIncr>
            <fileSize>18979371</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>EN</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softId>92</softId>
            <softName>ECUAID</softName>
            <softPackageID>ECUAID</softPackageID>
            <versionDetailId>366146</versionDetailId>
            <versionNo>V12.11</versionNo>
          </x431PadSoftIncr>
        </x431PadSoftIncrList>
      </return>
    </ns1:queryLatestDiagSoftsIncrCdn>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
});

// 3. التحميل وبث الملفات (ضع ملفات الـ zip في مجلد packages مسماة بـ versionDetailId.zip)
app.get('/api/v2/download', (req, res) => {
    const file = `${__dirname}/packages/${req.query.versionDetailId}.zip`;
    if (fs.existsSync(file)) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', fs.statSync(file).size);
        res.setHeader('code', '0');
        res.setHeader('sign', '30e0d3eaed78af141d079375e0f59b0c');
        fs.createReadStream(file).pipe(res);
    } else {
        res.status(404).send('File not found');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
