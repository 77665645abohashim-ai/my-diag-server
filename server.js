const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;
const MY_DOMAIN = 'https://my-diag-server.onrender.com';

// إعدادات قراءة البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// 1. منع التخزين المؤقت (Cache)
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// 2. خريطة توجيه المسارات الكاملة والشاملة
const fullRoutingResponse = {
    "code": 0,
    "msg": "success",
    "version": "74",
    "area": "2",
    "data": {
        "urls": [
            { "key": "login", "value": "https://diagboss.ch/api/v2/login" },
            { "key": "check-token", "value": `${MY_DOMAIN}/api/v2/check-token` },
            { "key": "productservice.*", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "publicsoftservice.*", "value": `${MY_DOMAIN}/api/v2/publicsoftservice` },
            { "key": "publicsoftservice.nt", "value": `${MY_DOMAIN}/api/v2/publicsoftservice-nt` },
            { "key": "x431padpublicsoftservice.*", "value": `${MY_DOMAIN}/api/v2/publicsoftservice` },
            { "key": "x431paddiagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "diagnosticLog.query", "value": `${MY_DOMAIN}/api/v2/diagnosticLog` },
            { "key": "createDiagSoftOrder", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "checkProductToUpgrade", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "user.set_base", "value": `${MY_DOMAIN}/api/v2/user-set-base` },
            { "key": "user.set_area", "value": `${MY_DOMAIN}/api/v2/user-set-area` },
            { "key": "user.get_base_info_car_logo", "value": `${MY_DOMAIN}/api/v2/user-get-base-info-car-logo` },
            { "key": "area.get_country_list", "value": `${MY_DOMAIN}/api/v2/area-get-country-list` },
            { "key": "userinfo.set_password", "value": `${MY_DOMAIN}/api/v2/set-password` },
            { "key": "addRepairShop", "value": `${MY_DOMAIN}/api/v2/addRepairShop` },
            { "key": "queryRepairShop", "value": `${MY_DOMAIN}/api/v2/queryRepairShop` },
            { "key": "publicsoft.download", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "downloaddiagsoftws.action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "publicsoft_breakpoint_action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "diagsoft_breakpoint_action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "dlDiagSoftPack.action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "diagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "activation", "value": "https://diagboss.ch/api/v2/activation" },
            { "key": "log.upload", "value": `${MY_DOMAIN}/api/v2/log-service-upload` },
            { "key": "report_list", "value": `${MY_DOMAIN}/api/v2/httapi-report-list` },
            { "key": "getAutoCodeByVin", "value": `${MY_DOMAIN}/api/v2/getAutoCodeByVin` },
            { "key": "getAutoEntranceIdByVin", "value": `${MY_DOMAIN}/api/v2/getAutoEntranceIdByVin` },
            { "key": "programfile.download_new", "value": `${MY_DOMAIN}/api/v2/download-programming` },
            { "key": "td.query-state", "value": "https://diagboss.ch/api/v2/td-query-state" },
            { "key": "td.report-state", "value":"https://diagboss.ch/api/v2/td-report-state" },
            { "key": "td.upload-cert", "value": `${MY_DOMAIN}/api/v2/td-upload-cert` },
            { "key": "td.check-locked", "value": "https://diagboss.ch/api/v2/td-check-locked" },
            { "key": "td2.flasher", "value": `${MY_DOMAIN}/api/v2/td2-flasher` },
            { "key": "onlinelic", "value": `${MY_DOMAIN}/api/v2/onlinelic` },
            { "key": "pubaccount.pid_byt", "value": `${MY_DOMAIN}/api/v2/pid-byt` },
            { "key": "friend.list", "value": `${MY_DOMAIN}/api/v2/friend-list` },
            { "key": "user.s_search", "value": `${MY_DOMAIN}/api/v2/friend-search` },
            { "key": "recover_password", "value": `${MY_DOMAIN}/api/v2/recover-password` },
            { "key": "reg_step_", "value": `${MY_DOMAIN}/api/v2/reg-step` },
            { "key": "get_tpmsgun_bingding_devices", "value": `${MY_DOMAIN}/api/v2/get-pressure-device-list` },
            { "key": "unbinding_tpmsgun_device", "value": `${MY_DOMAIN}/api/v2/delete-pressure-device` },
            { "key": "binding_tpmsgun_device", "value": `${MY_DOMAIN}/api/v2/binding-pressure-device` },
            { "key": "sendDiagnosticLog", "value": `${MY_DOMAIN}/api/v2/send-diagnostic-log` },
            { "key": "funch_url1", "value": "https://repairdata.webdiag.name/serve/rest/queryHelpDtcDocBycondition" },
            { "key": "funch_url2", "value": "https://repairdata.webdiag.name/serve/rest/queryFunchDocBycondition" },
            { "key": "adas_register_url", "value": `${MY_DOMAIN}/api/v2/adas-card-reg` },
            { "key": "adas_get_data_url", "value": `${MY_DOMAIN}/api/v2/get-adas-key-by-sn` },
            { "key": "adas_get_data_hd_url", "value": `${MY_DOMAIN}/api/v2/get-hdadas-key-by-sn` },
            { "key": "burnquery", "value": `${MY_DOMAIN}/api/v2/burnquery` },
            { "key": "burn", "value": `${MY_DOMAIN}/api/v2/burn` },
            { "key": "burnstatus", "value": `${MY_DOMAIN}/api/v2/burnstatus` },
            { "key": "diagonline_url", "value": `${MY_DOMAIN}/api/v2/diagonline` },
            { "key": "diagreq_uploadzip_method", "value": "-kiswb-ziprequest/" },
            { "key": "diagreq_uploadxml_method", "value": "-kiswb-xmlrequest/" },
            { "key": "diagresult_queryjson_method", "value": "-kiswb-zipresponse/" },
            { "key": "diagonline_response_url", "value": `${MY_DOMAIN}/api/v2/diagonline-kiswb-zipresponse/` },
            { "key": "diagonline_request_url", "value": `${MY_DOMAIN}/api/v2/diagonline-kiswb-ziprequest/` },
            { "key": "uploadECUFile_url", "value": `${MY_DOMAIN}/api/v2/diagonline-ecurecordfile` },
            { "key": "onlineArithQuery_url", "value": `${MY_DOMAIN}/api/v2/diagonline-gettransdiagdataex` },
            { "key": "onlineArithQuery_new_url", "value": `${MY_DOMAIN}/api/v2/diagonline-gettransdiagdataex-new` },
            { "key": "onlineFaultCodeQuery_url", "value": `${MY_DOMAIN}/api/v2/diagonline-faultcodequery` },
            { "key": "onlineFaultCodeHelpQuery_url", "value": `${MY_DOMAIN}/api/v2/diagonline-faultcodehelpquery` },
            { "key": "onlineFaultCodeQueryWithSys_url", "value": `${MY_DOMAIN}/api/v2/diagonline-getdiagsoftdtc` },
            { "key": "onlineFaultCodeHelpQueryWithSys_url", "value": `${MY_DOMAIN}/api/v2/diagonline-getdiagsoftdtchelp` },
            { "key": "onlineUploadCarInfo_url", "value": `${MY_DOMAIN}/api/v2/diagonline-addcardata` },
            { "key": "get_dtcs_ds_url", "value": `${MY_DOMAIN}/api/v2/diagonline-getfaultcodeflow` },
            { "key": "ds_upload_dtcs_ds_url", "value": `${MY_DOMAIN}/api/v2/diagonline-uploadfaultcodeflow` },
            { "key": "upload_diag_statistic_url", "value": `${MY_DOMAIN}/api/v2/diagonline-softuploadrecord` },
            { "key": "download_multi_files_url", "value": `${MY_DOMAIN}/api/v2/diagonline-multi-files` },
            { "key": "query_diagcar_data", "value": `${MY_DOMAIN}/api/v2/diagonline-query-diagcar-data-new` },
            { "key": "query_diagcar_data_new", "value": `${MY_DOMAIN}/api/v2/diagonline-query-diagcar-data-new` },
            { "key": "haynes", "value": `${MY_DOMAIN}/api/v2/haynes` },
            { "key": "europe_web_fca_token_url", "value": `${MY_DOMAIN}/api/v2/fca-token` },
            { "key": "europe_web_fca_code_login_url", "value": `${MY_DOMAIN}/api/v2/fca-login` },
            { "key": "europe_web_fca_level3auth_url", "value": `${MY_DOMAIN}/api/v2/fca-level3auth` },
            { "key": "europe_web_fca_signed_url", "value": `${MY_DOMAIN}/api/v2/fca-signedchallenge` },
            { "key": "europe_web_fca_track_url", "value": `${MY_DOMAIN}/api/v2/fca-trackresponse` },
            { "key": "uploadEcuProgramData", "value": `${MY_DOMAIN}/api/v2/uploadEcuProgramData` },
            { "key": "getConditionDataOnline", "value": `${MY_DOMAIN}/api/v2/getConditionDataOnline` },
            { "key": "file.upload", "value": `${MY_DOMAIN}/api/v2/file-upload` },
            { "key": "getExpertDataFlow", "value": `${MY_DOMAIN}/api/v2/getExpertDataFlow` },
            { "key": "getExpertDataFlow_new", "value": `${MY_DOMAIN}/api/v2/getExpertDataFlow-new` },
            { "key": "downloaddocumentws.action", "value": `${MY_DOMAIN}/api/v2/download-document` },
            { "key": "multipagecomp_html_url", "value": `${MY_DOMAIN}/api/v2/multipagecomp-html-url-new` },
            { "key": "motorCardReg", "value": `${MY_DOMAIN}/api/v2/motorCardReg?` },
            { "key": "getMotorUrlBySn", "value": `${MY_DOMAIN}/api/v2/getMotorUrlBySn?` },
            { "key": "query_adas_product", "value": `${MY_DOMAIN}/api/v2/query-adas-product` },
            { "key": "query_adas_soft_file", "value": `${MY_DOMAIN}/api/v2/query-adas-soft-file` },
            { "key": "query_adas_soft_file_by_id", "value": `${MY_DOMAIN}/api/v2/query-adas-soft-file-by-id` },
            { "key": "adas_soft_file_down_loadurl", "value": `${MY_DOMAIN}/api/v2/adas-soft-file-down-loadurl` },
            { "key": "get_plate_by_vin", "value": "http://ait.golo365.com/Home/HttApi/getPlateByVin?" },
            { "key": "getVersionDetialIds", "value": `${MY_DOMAIN}/api/v2/getVersionDetialIds` }
        ]
    }
};

// 3. مسار الجذر و مسار الروابط الأساسي لتجنب خطأ 404
app.all(['/', '/api/v2/urls'], (req, res) => {
    res.json(fullRoutingResponse);
});

// 4. معالجة مسار رفع الروابط (تجربة مسار نسبي أو بيانات بديلة)
app.all('/api/v2/url-upload', (req, res) => {
    console.log("URL Upload Request Body:", req.body);
    console.log("URL Upload Request Query:", req.query);

    res.json({
        "code": 0,
        "msg": "success",
        "data": {
            "url": "",
            "path": "/api/v2/download",
            "file": "success"
        }
    });
});



// 5. مسار خدمات المنتجات
app.all('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46><return><code>0</code><productDTOs><carLicenseTag></carLicenseTag><serialNo>979862374489</serialNo><dzKey>WpFNRUnQThVAz/lNTGrq3nhN5bmcNSo7Ntdj4fv5pfWUEWWWi2V+xYALPP7K4obNxNLJhoRbCHaObSQJV2s86E+yE6xsvZJL5Z6fYPjbfb6bWI1hL3FkA3qhH50vBAMo7BAslnf7aT1hcVbJRIqWbnIhhLILmZ+h5naRReqc3ZyXP/T0Mx3TJTksXkIE2P9x</dzKey><pdtCategory>2</pdtCategory></productDTOs><productDTOs><carLicenseTag></carLicenseTag><serialNo>989140722496</serialNo><dzKey>NgfpI+Mvntqj2KiEZmVEIH7XofYtj7mqUm7QIcum+iRS7DGNlIfioKgGo5KaPjQipeMoccwg/n6orcrV0Bd+GaKbjfi/m7x3yKniRVhtl3iVmxUmbKpl9J/3K3pDRvNy4M0rlPu/O1too9z+NRqXy2TwBTlXIVgvzRxiNnGChzqEtWnbpG/JDB2S8vkW4d10</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 6. مسار سجلات التشخيص
app.all('/api/v2/diagnosticLog', (req, res) => {
    res.json({ "code": 0, "msg": "success" });
});

// 7. مسار خدمات البرامج والماركات العام
app.all('/api/v2/publicsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts><return><code>0</code><message>success</message><x431PadSoftList><x431PadSoft><fileSize>68365802</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softId>1015</softId><softName>Diagzone PRO V2</softName><softPackageID>Diagzone_PRO_V2</softPackageID><softUpdateTime>2025-03-08 00:00:00</softUpdateTime><versionDetailId>359645</versionDetailId><versionNo>V2.00.033</versionNo></x431PadSoft><x431PadSoft><fileSize>393300</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softId>873</softId><softName>Firmware</softName><softPackageID>DOWNLOAD</softPackageID><softUpdateTime>2023-03-27 00:00:00</softUpdateTime><versionDetailId>343730</versionDetailId><versionNo>V11.91</versionNo></x431PadSoft></x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 8. مسار خدمات البرامج (NT)
app.all('/api/v2/publicsoftservice-nt', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getMaxVersionForMobileAppCDN><return><code>0</code><message>success</message><appSoftSoftMaxVersion></appSoftSoftMaxVersion></return></ns1:getMaxVersionForMobileAppCDN></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 9. مسار البرمجيات والماركات التشخيصية (بالقالب الحقيقي الكامل)
app.all('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    
    const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    console.log("Diagsoftservice Request Received:", requestBody);

    let soapMethodName = "queryPDTDiagSoftSubPack";
    let innerResponseContent = "";

    // الرد بالهيكل الحقيقي الكامل عند طلب التحديثات
    if (requestBody.includes("queryLatestDiagSoftsIncrCdn")) {
        soapMethodName = "queryLatestDiagSoftsIncrCdn";
        innerResponseContent = `<code>0</code><message>success</message><x431PadSoftIncrList><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>55740637</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>69</softId><softName>Demo</softName><softPackageID>DEMO</softPackageID><softUpdateTime>2026-03-04 10:32:08</softUpdateTime><versionDetailId>380901</versionDetailId><versionNo>V15.68</versionNo></x431PadSoftIncr><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>2305655</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1452</softId><softName>Demo (BMS)</softName><softPackageID>BMS_DEMO</softPackageID><softUpdateTime>2024-05-30 09:48:23</softUpdateTime><versionDetailId>367837</versionDetailId><versionNo>V15.55</versionNo></x431PadSoftIncr><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>6656601</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1366</softId><softName>Demo (EV)</softName><softPackageID>EV_DEMO</softPackageID><softUpdateTime>2026-03-04 11:01:01</softUpdateTime><versionDetailId>381744</versionDetailId><versionNo>V15.68</versionNo><tab>EV</tab></x431PadSoftIncr><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>2241856</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1150</softId><softName>DEMO Motor</softName><softPackageID>MT_DEMO</softPackageID><softUpdateTime>2024-11-21 15:26:22</softUpdateTime><versionDetailId>363814</versionDetailId><versionNo>V10.11</versionNo></x431PadSoftIncr><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>18979371</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>92</softId><softName>ECUAID</softName><softPackageID>ECUAID</softPackageID><softUpdateTime>2025-12-08 16:02:02</softUpdateTime><versionDetailId>366146</versionDetailId><versionNo>V12.11</versionNo></x431PadSoftIncr><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>2590675</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>93</softId><softName>EOBD/OBDII</softName><softPackageID>EOBD2</softPackageID><softUpdateTime>2025-08-14 09:43:52</softUpdateTime><versionDetailId>362272</versionDetailId><versionNo>V23.12</versionNo></x431PadSoftIncr><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>89446936</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>9</softId><softName>VINSCAN Service</softName><softPackageID>AUTOSEARCH</softPackageID><softUpdateTime>2025-10-24 10:05:07</softUpdateTime><versionDetailId>365206</versionDetailId><versionNo>V11.15</versionNo></x431PadSoftIncr><x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>1991767</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1145</softId><softName>VINSCAN Service (HD)</softName><softPackageID>HD_AUTOSEARCH</softPackageID><softUpdateTime>2025-08-06 09:32:58</softUpdateTime><versionDetailId>362469</versionDetailId><versionNo>V10.85</versionNo><tab>HD</tab></x431PadSoftIncr></x431PadSoftIncrList>`;
    } 
    // الرد على الطلب الثاني الخاص بالحزم الفرعية
    else {
        soapMethodName = "queryPDTDiagSoftSubPack";
        innerResponseContent = `<code>0</code><message>success</message><diagSoftSubPackList><diagSoftSubPack><spfId><softSubPackKey>AUDI_DIV01</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A1,A2</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 1(AUDI A1,A2)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>22</spfId><softSubPackKey>AUDI_DIV02</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A3</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 2(AUDI A3)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>23</spfId><softSubPackKey>AUDI_DIV03</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A3(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 3(AUDI A3 USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>24</spfId><softSubPackKey>AUDI_DIV04</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A4</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 4(AUDI A4)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>25</spfId><softSubPackKey>AUDI_DIV05</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A4(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 5(AUDI A4 USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>26</spfId><softSubPackKey>AUDI_DIV06</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A5,A7,Cabriolet</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 6(AUDI A5,A7,Cabriolet)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>27</spfId><softSubPackKey>AUDI_DIV07</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A5(USA/CAN),A7(USA/CAN),Cabriolet(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 7((AUDI A5,A7,Cabriolet)USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>28</spfId><softSubPackKey>AUDI_DIV08</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A6</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 8(AUDI A6)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>29</spfId><softSubPackKey>AUDI_DIV09</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A6(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 9(AUDI A6 USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>30</spfId><softSubPackKey>AUDI_DIV10</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A8</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 10(AUDI A8)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>31</spfId><softSubPackKey>AUDI_DIV11</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A8(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 11(AUDI A8 USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>32</spfId><softSubPackKey>AUDI_DIV12</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi Q3,Q5</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 12(AUDI Q3,Q5)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>33</spfId><softSubPackKey>AUDI_DIV13</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi Q3(USA/CAN),Q5(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 13((AUDI Q3,Q5)USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>34</spfId><softSubPackKey>AUDI_DIV14</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi Q7</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 14(AUDI Q7)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>35</spfId><softSubPackKey>AUDI_DIV15</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi Q7(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 15(AUDI Q7 USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>36</spfId><softSubPackKey>AUDI_DIV16</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi TT</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 16(AUDI TT)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>37</spfId><softSubPackKey>AUDI_DIV17</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi TT(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 17(AUDI TT USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>38</spfId><softSubPackKey>AUDI_DIV18</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi R8</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 18(AUDI R8)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>39</spfId><softSubPackKey>AUDI_DIV19</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi R8(USA/CAN)</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 19(AUDI R8 USA/CAN)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>59</spfId><softSubPackKey>AUDI_DIV20</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guide functions of the Audi Q2 and e-tron</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 20(AUDI Q2, e-tron)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>60</spfId><softSubPackKey>AUDI_DIV21</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guide functions of the Audi Q8</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 21(AUDI Q8)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>61</spfId><softSubPackKey>AUDI_DIV22</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the online function of AUDI</spfDesc><softId>6</softId><spfNameDesc>AUDI online function package</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>223</spfId><softSubPackKey>AUDI_DIV23</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guide functions of the Audi Q4</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 23(AUDI Q4)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>82</spfId><softSubPackKey>AUDI_DIV30</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains ADAS functions of AUDI</spfDesc><softId>6</softId><spfNameDesc>AUDI ADAS function package</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>62</spfId><softSubPackKey>SEAT_DIV30</softSubPackKey><softPackageId>SEAT</softPackageId><softDesc>Seat</softDesc><spfDesc>This package contains ADAS functions of SEAT</spfDesc><softId>339</softId><spfNameDesc>SEAT ADAS function package</spfNameDesc><vNum>28.53</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>49</spfId><softSubPackKey>SKODA_DIV01</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Octavia</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 1(SKODA Octavia)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>50</spfId><softSubPackKey>SKODA_DIV02</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Fabia</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 2(SKODA Fabia)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>51</spfId><softSubPackKey>SKODA_DIV03</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Superb</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 3(SKODA Superb)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>63</spfId><softSubPackKey>SKODA_DIV04</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Roomster</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 4(SKODA Roomster)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>52</spfId><softSubPackKey>SKODA_DIV05</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Kodiaq</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 5(SKODA Kodiaq)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>64</spfId><softSubPackKey>SKODA_DIV06</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Yeti</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 6(SKODA Yeti)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>53</spfId><softSubPackKey>SKODA_DIV07</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Rapid</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 7(SKODA Rapid)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>65</spfId><softSubPackKey>SKODA_DIV08</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Citigo</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 8(SKODA Citigo)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>66</spfId><softSubPackKey>SKODA_DIV09</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Karoq</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 9(Karoq)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>67</spfId><softSubPackKey>SKODA_DIV10</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Kamiq and Scala</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 10(Kamiq/Scala)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>225</spfId><softSubPackKey>SKODA_DIV12</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Enyaq</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 12(Enyaq)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>232</spfId><softSubPackKey>SKODA_DIV13</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains the guided functions of the SKODA Kushaq and Slavia</spfDesc><softId>354</softId><spfNameDesc>SKODA Guided function package 13(Kushaq, Slavia)</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>68</spfId><softSubPackKey>SKODA_DIV30</softSubPackKey><softPackageId>SKODA</softPackageId><softDesc>Skoda</softDesc><spfDesc>This package contains ADAS functions of SKODA</spfDesc><softId>354</softId><spfNameDesc>SKODA ADAS function package</spfNameDesc><vNum>28.56</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>40</spfId><softSubPackKey>YQVW_DIV01</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV01</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV01</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>41</spfId><softSubPackKey>YQVW_DIV02</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV02</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV02</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>42</spfId><softSubPackKey>YQVW_DIV03</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV03</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV03</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>43</spfId><softSubPackKey>YQVW_DIV04</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV04</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV04</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>44</spfId><softSubPackKey>YQVW_DIV05</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV05</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV05</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>88</spfId><softSubPackKey>YQVW_DIV06</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>This package contains the guide functions of the YQVW Sportsvan and T-Roc</spfDesc><softId>402</softId><spfNameDesc>YQVW Guided function package 06(Sportvan, T-Roc)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>89</spfId><softSubPackKey>YQVW_DIV07</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>This package contains the guide functions of the YQVW Tayron and CC Fastback</spfDesc><softId>402</softId><spfNameDesc>YQVW Guided function package 07(Tayron, CC Fastback)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>90</spfId><softSubPackKey>YQVW_DIV08</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>This package contains the online function of YQVW</spfDesc><softId>402</softId><spfNameDesc>YQVW online function package</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>91</spfId><softSubPackKey>YQVW_DIV09</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV09</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV09</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>228</spfId><softSubPackKey>YQVW_DIV10</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV10</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV10</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>229</spfId><softSubPackKey>YQVW_DIV11</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV11</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV11</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>92</spfId><softSubPackKey>YQVW_DIV30</softSubPackKey><softPackageId>YQVW</softPackageId><softDesc>VW (FAW)</softDesc><spfDesc>YQVW_DIV30</spfDesc><softId>402</softId><spfNameDesc>YQVW_DIV30</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>1</spfId><softSubPackKey>SHVW_DIV01</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV01</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV01</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>2</spfId><softSubPackKey>SHVW_DIV02</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV02</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV02</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>3</spfId><softSubPackKey>SHVW_DIV03</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV03</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV03</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>4</spfId><softSubPackKey>SHVW_DIV04</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV04</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV04</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>5</spfId><softSubPackKey>SHVW_DIV05</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV05</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV05</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>6</spfId><softSubPackKey>SHVW_DIV06</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV06</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV06</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>83</spfId><softSubPackKey>SHVW_DIV07</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>This package contains the guide functions of the SHVW Teramont and Phideon</spfDesc><softId>350</softId><spfNameDesc>SHVW Guided function package 07(Teramont Phideon)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>84</spfId><softSubPackKey>SHVW_DIV08</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>This package contains the guide functions of the SHVW Tharu and T-Cross</spfDesc><softId>350</softId><spfNameDesc>SHVW Guided function package 08(Tharu, T-Cross)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>85</spfId><softSubPackKey>SHVW_DIV09</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>This package contains the online function of SHVW</spfDesc><softId>350</softId><spfNameDesc>SHVW online function package</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>86</spfId><softSubPackKey>SHVW_DIV10</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV10</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV10</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>222</spfId><softSubPackKey>SHVW_DIV11</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV11</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV11</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>224</spfId><softSubPackKey>SHVW_DIV12</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV12</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV12</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>87</spfId><softSubPackKey>SHVW_DIV30</softSubPackKey><softPackageId>SHVW</softPackageId><softDesc>VW (SAIC)</softDesc><spfDesc>SHVW_DIV30</spfDesc><softId>350</softId><spfNameDesc>SHVW_DIV30</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>7</spfId><softSubPackKey>VW_DIV01</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include up, Tiguan, Touareg Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 1</spfNameDesc><vNum>29.06</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>8</spfId><softSubPackKey>VW_DIV02</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Eos Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 2</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>9</spfId><softSubPackKey>VW_DIV03</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Golf Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 3</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>10</spfId><softSubPackKey>VW_DIV04</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Touran Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 4</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>11</spfId><softSubPackKey>VW_DIV05</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Passat Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 5</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>12</spfId><softSubPackKey>VW_DIV06</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Polo Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 6</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>13</spfId><softSubPackKey>VW_DIV07</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Sharan Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 7</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>14</spfId><softSubPackKey>VW_DIV08</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Beetle Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 8</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>15</spfId><softSubPackKey>VW_DIV09</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Jetta Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 9</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>16</spfId><softSubPackKey>VW_DIV10</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Gol Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 10</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>17</spfId><softSubPackKey>VW_DIV11</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Fox, Lupo, Suran, Sportvan, Space Cross Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 11</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>18</spfId><softSubPackKey>VW_DIV12</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Santana, Rabbit, Scirocco, XL1, Kombi, Lupo Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 12</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>19</spfId><softSubPackKey>VW_DIV13</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Phaeton Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 13</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>20</spfId><softSubPackKey>VW_DIV14</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Bora Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided Functions 14</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>69</spfId><softSubPackKey>VW_DIV15</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains the guided functions of the VW T-Roc,T-Cross and Atlas</spfDesc><softId>379</softId><spfNameDesc>VW Guided function package 15(T-Roc,T-Cross,Atlas)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>70</spfId><softSubPackKey>VW_DIV16</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains the guide functions of the VW Arteon</spfDesc><softId>379</softId><spfNameDesc>VW Guided function package 16(Arteon)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>230</spfId><softSubPackKey>VW_DIV17</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains the guide functions of the VW Caddy and Amarok</spfDesc><softId>379</softId><spfNameDesc>VW Guided function package 17(Caddy,Amarok)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>231</spfId><softSubPackKey>VW_DIV18</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains the guide functions of the VW Transporter and Crafter</spfDesc><softId>379</softId><spfNameDesc>VW Guided function package 18(Transporter,Crafter)</spfNameDesc><vNum>29.06</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>71</spfId><softSubPackKey>VW_DIV19</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains the online function of VW</spfDesc><softId>379</softId><spfNameDesc>VW Online function package</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>72</spfId><softSubPackKey>VW_DIV20</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains the guide functions of the VW Nivus and ID.3</spfDesc><softId>379</softId><spfNameDesc>VW Guided function package 20(Nivus,ID.3)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>226</spfId><softSubPackKey>VW_DIV21</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains the guide functions of the VW Taos and ID.4</spfDesc><softId>379</softId><spfNameDesc>VW Guided function package 21(Taos,ID.4)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>227</spfId><softSubPackKey>VW_DIV24</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>VW Guided Functions: Include Tarek,Taigo,ID.5 Guided Functions</spfDesc><softId>379</softId><spfNameDesc>VW Guided function package 24(Tarek,Taigo,ID.5)</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>221</spfId><softSubPackKey>VW_DIV30</softSubPackKey><softPackageId>VW</softPackageId><softDesc>VW/Bentley/Bugatti/Lamborghini</softDesc><spfDesc>This package contains ADAS functions of VW.</spfDesc><softId>379</softId><spfNameDesc>VW ADAS function package</spfNameDesc><vNum>29.05</vNum><fileSize>0</fileSize></diagSoftSubPack></diagSoftSubPackList></return></ns1:queryPDTDiagSoftSubPack></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    }

    const finalSoapResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <SOAP-ENV:Body>
            <ns1:${soapMethodName}>
                <return>${innerResponseContent}</return>
            </ns1:${soapMethodName}>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

    res.status(200).send(finalSoapResponse);
});
const fs = require('fs');
const path = require('path');

// مسار تخزين الملفات الوهمية أو الحقيقية على السيرفر (تأكد من وجود المجلد أو سيتم إنشاؤه تلقائياً)
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// 10. مسار التحميل الشامل ودعم استكمال التحميل (Breakpoint Download)
app.all('/api/v2/download', (req, res) => {
    console.log("Download Request Headers:", req.headers);
    console.log("Download Request Query/Body:", req.query, req.body);

    // استخراج اسم الملف أو معرف الإصدار من الطلب (افتراضي للتجربة)
    // يمكنك تعديل هذه المنطقية لاستخراج اسم الملف بناءً على الرابط أو البارامترات المرسلة
    const fileName = req.query.fileName || req.body?.fileName || 'default_soft.zip';
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    // لو الملف غير موجود، نقوم بتوليد ملف وهمي صغير (أو ملف نصي/ضغط) لغرض التجربة والاختبار
    if (!fs.existsSync(filePath)) {
        // إنشاء ملف وهمي حجمه 1 ميجابايت مثلاً لكي ينجح التحميل
        const buffer = Buffer.alloc(1024 * 1024, 'X'); 
        fs.writeFileSync(filePath, buffer);
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // دعم خاصية الاستكمال (Range Header) التي يرسلها التطبيق عند انقطاع الاتصال
    const range = req.headers.range;
    
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        const file = fs.createReadStream(filePath, { start, end });
        
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'application/octet-stream',
        });
        
        file.pipe(res);
        console.log(`Resuming download from byte ${start} to ${end}`);
    } else {
        // إرسال الملف كاملاً من البداية
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'application/octet-stream',
            'Accept-Ranges': 'bytes'
        });
        
        fs.createReadStream(filePath).pipe(res);
        console.log(`Starting full download for: ${fileName}`);
    }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
