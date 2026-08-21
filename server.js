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
            { "key": "td.report-state", "value": `${MY_DOMAIN}/api/v2/td-report-state` },
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

// 4. معالجة مسار رفع الروابط
app.all('/api/v2/url-upload', (req, res) => {
    res.json({ "code": 0, "msg": "success" });
});

// 5. مسار خدمات المنتجات (الرد المزدوج للمنتجات المسجلة)
app.all('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46><return><code>0</code><productDTOs><carLicenseTag></carLicenseTag><serialNo>979862374489</serialNo><dzKey>WpFNRUnQThVAz/lNTGrq3nhN5bmcNSo7Ntdj4fv5pfWUEWWWi2V+xYALPP7K4obNxNLJhoRbCHaObSQJV2s86E+yE6xsvZJL5Z6fYPjbfb6bWI1hL3FkA3qhH50vBAMo7BAslnf7aT1hcVbJRIqWbnIhhLILmZ+h5naRReqc3ZyXP/T0Mx3TJTksXkIE2P9x</dzKey><pdtCategory>2</pdtCategory></productDTOs><productDTOs><carLicenseTag></carLicenseTag><serialNo>989140722496</serialNo><dzKey>NgfpI+Mvntqj2KiEZmVEIH7XofYtj7mqUm7QIcum+iRS7DGNlIfioKgGo5KaPjQipeMoccwg/n6orcrV0Bd+GaKbjfi/m7x3yKniRVhtl3iVmxUmbKpl9J/3K3pDRvNy4M0rlPu/O1too9z+NRqXy2TwBTlXIVgvzRxiNnGChzqEtWnbpG/JDB2S8vkW4d10</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});
// معالجة مسار سجلات التشخيص لتجنب خطأ 404
app.all('/api/v2/diagnosticLog', (req, res) => {
    res.json({ "code": 0, "msg": "success" });
});

// 6. مسار خدمات البرامج والماركات (محدث بـ queryLatestPublicSofts)
app.all('/api/v2/publicsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts><return><code>0</code><message>success</message><x431PadSoftList><x431PadSoft><fileSize>68365802</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softId>1015</softId><softName>Diagzone PRO V2</softName><softPackageID>Diagzone_PRO_V2</softPackageID><softUpdateTime>2025-03-08 00:00:00</softUpdateTime><versionDetailId>359645</versionDetailId><versionNo>V2.00.033</versionNo></x431PadSoft><x431PadSoft><fileSize>393300</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softId>873</softId><softName>Firmware</softName><softPackageID>DOWNLOAD</softPackageID><softUpdateTime>2023-03-27 00:00:00</softUpdateTime><versionDetailId>343730</versionDetailId><versionNo>V11.91</versionNo></x431PadSoft><x431PadSoft><fileSize>6166636</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softId>880</softId><softName>VIN Recognition App</softName><softPackageID>VIN_RECOGNITION_APP</softPackageID><softUpdateTime>2024-05-02 00:00:00</softUpdateTime><versionDetailId>354418</versionDetailId><versionNo>V1.01.006</versionNo></x431PadSoft></x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 7. مسار خدمات البرامج (NT)
app.all('/api/v2/publicsoftservice-nt', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getMaxVersionForMobileAppCDN><return><code>0</code><message>success</message><appSoftSoftMaxVersion></appSoftSoftMaxVersion></return></ns1:getMaxVersionForMobileAppCDN></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 8. مسار البرمجيات والماركات التشخيصية (محدث بكامل الحزم)
app.all('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryPDTDiagSoftSubPack><return><code>0</code><message>success</message><diagSoftSubPackList><diagSoftSubPack><spfId>21</spfId><softSubPackKey>AUDI_DIV01</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A1,A2</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 1(AUDI A1,A2)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack><diagSoftSubPack><spfId>22</spfId><softSubPackKey>AUDI_DIV02</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A3</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 2(AUDI A3)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack></diagSoftSubPackList></return></ns1:queryPDTDiagSoftSubPack></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
