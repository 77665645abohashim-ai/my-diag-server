// 4. معالجة طلبات الاستعلام والتحديثات (SOAP) في نفس المسار
app.post('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
    
    // تحويل الطلب الوارد إلى نص للتحقق من نوع الدالة المطلوبة
    const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');

    // 1. إذا كان الطلب يخص حزم التحديثات والـ Cdn
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
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>2305655</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>AR</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>1452</softId>
            <softName>Demo (BMS)</softName>
            <softPackageID>BMS_DEMO</softPackageID>
            <softUpdateTime>2024-05-30 09:48:23</softUpdateTime>
            <versionDetailId>367837</versionDetailId>
            <versionNo>V15.55</versionNo>
          </x431PadSoftIncr>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>6656601</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>AR</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>1366</softId>
            <softName>Demo (EV)</softName>
            <softPackageID>EV_DEMO</softPackageID>
            <softUpdateTime>2026-03-04 11:01:01</softUpdateTime>
            <versionDetailId>381744</versionDetailId>
            <versionNo>V15.68</versionNo>
            <tab>EV</tab>
          </x431PadSoftIncr>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>2241856</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>EN</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>1150</softId>
            <softName>DEMO Motor</softName>
            <softPackageID>MT_DEMO</softPackageID>
            <softUpdateTime>2024-11-21 15:26:22</softUpdateTime>
            <versionDetailId>363814</versionDetailId>
            <versionNo>V10.11</versionNo>
          </x431PadSoftIncr>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>18979371</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>EN</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>92</softId>
            <softName>ECUAID</softName>
            <softPackageID>ECUAID</softPackageID>
            <softUpdateTime>2025-12-08 16:02:02</softUpdateTime>
            <versionDetailId>366146</versionDetailId>
            <versionNo>V12.11</versionNo>
          </x431PadSoftIncr>
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
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>89446936</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>AR</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>9</softId>
            <softName>VINSCAN Service</softName>
            <softPackageID>AUTOSEARCH</softPackageID>
            <softUpdateTime>2025-10-24 10:05:07</softUpdateTime>
            <versionDetailId>365206</versionDetailId>
            <versionNo>V11.15</versionNo>
          </x431PadSoftIncr>
          <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType>
            <fileSize>1991767</fileSize>
            <freeUseEndTime>2099-01-01</freeUseEndTime>
            <lanId>EN</lanId>
            <serverCurrentTime>2026-08-21</serverCurrentTime>
            <softApplicableArea>5</softApplicableArea>
            <softId>1145</softId>
            <softName>VINSCAN Service (HD)</softName>
            <softPackageID>HD_AUTOSEARCH</softPackageID>
            <softUpdateTime>2025-08-06 09:32:58</softUpdateTime>
            <versionDetailId>362469</versionDetailId>
            <versionNo>V10.85</versionNo>
            <tab>HD</tab>
          </x431PadSoftIncr>
        </x431PadSoftIncrList>
      </return>
    </ns1:queryLatestDiagSoftsIncrCdnResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
    }

    // 2. إذا كان الطلب يخص حزم الفحص الموجه (Guided Functions)
    if (requestBody.includes('queryPDTDiagSoftSubPack')) {
        return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryPDTDiagSoftSubPackResponse>
            <return>
                <code>0</code>
                <message>success</message>
                <diagSoftSubPackList>
                    <!-- ضع هنا حزم Audi, Skoda, VW, Seat التي أرسلتها مسبقاً -->
                </diagSoftSubPackList>
            </return>
        </ns1:queryPDTDiagSoftSubPackResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
    }

    // 3. رد افتراضي لأي طلب آخر غير متوقع على نفس المسار
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
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
