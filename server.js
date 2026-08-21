const express = require('express');
const app = express();

// استخدام وسيط لقراءة النصوص أو البيانات القادمة من التطبيق
app.use(express.text({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. مسار خدمة البرامج العامة (Public Soft Service)
app.post('/api/v2/publicsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    
    const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');

    // معالجة طلب جلب البرامج العامة (queryLatestPublicSofts)
    if (requestBody.includes('queryLatestPublicSofts')) {
        return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <SOAP-ENV:Body>
    <ns1:queryLatestPublicSoftsResponse>
      <return>
        <code>0</code>
        <message>success</message>
        <x431PadSoftIncrList>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>2590675</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>AR</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>93</softId>
            <softName>EOBD/OBDII</softName>
            <softPackageID>EOBD2</softPackageID>
            <softUpdateTime>2025-08-14 09:43:52</softUpdateTime>
            <versionDetailId>362272</versionDetailId>
            <versionNo>V23.12</versionNo>
          </x431PadSoftIncr>
        </x431PadSoftIncrList>
      </return>
    </ns1:queryLatestPublicSoftsResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
    }

    // رد افتراضي لـ publicsoftservice
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
  <SOAP-ENV:Body>
    <ns1:response>
      <return>
        <code>0</code>
        <message>success</message>
      </return>
    </ns1:response>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
});

// 2. مسار خدمة التشخيص والعلامات (Diag Soft Service)
app.post('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    
    const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');

    // معالجة طلب الفحوصات والتحديثات الإضافية (IncrCdn)
    if (requestBody.includes('queryLatestDiagSoftsIncrCdn')) {
        return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <SOAP-ENV:Body>
    <ns1:queryLatestDiagSoftsIncrCdnResponse>
      <return>
        <code>0</code>
        <message>success</message>
        <x431PadSoftIncrList>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>55740637</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>AR</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>69</softId>
            <softName>Demo</softName>
            <softPackageID>DEMO</softPackageID>
            <softUpdateTime>2026-03-04 10:32:08</softUpdateTime>
            <versionDetailId>380901</versionDetailId>
            <versionNo>V15.68</versionNo>
          </x431PadSoftIncr>
        </x431PadSoftIncrList>
      </return>
    </ns1:queryLatestDiagSoftsIncrCdnResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
    }

    // معالجة طلب الحزم الفرعية الموجهة (Guided Functions)
    if (requestBody.includes('queryPDTDiagSoftSubPack')) {
        return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ns1:queryPDTDiagSoftSubPackResponse>
<return>
<code>0</code>
<message>success</message>
<diagSoftSubPackList>
<!-- أضف بيانات الحزم هنا إذا احتجتها مستقبلاً -->
</diagSoftSubPackList>
</return>
</ns1:queryPDTDiagSoftSubPackResponse>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
    }

    // رد افتراضي لـ diagsoftservice
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
  <SOAP-ENV:Body>
    <ns1:response>
      <return>
        <code>0</code>
        <message>success</message>
      </return>
    </ns1:response>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
