const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

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
            { "key": "check-token", "value":"https://diagboss.ch/api/v2/check-token" },
            { "key": "productservice.*", "value":"https://diagboss.ch/api/v2/product-service" },
            { "key": "publicsoftservice.*", "value":"https://my-diag-server.onrender.com/api/v2/publicsoftservice" },
            { "key": "publicsoftservice.nt", "value":"https://my-diag-server.onrender.com/api/v2/publicsoftservice-nt" },
            { "key": "x431padpublicsoftservice.*", "value":"https://my-diag-server.onrender.com/api/v2/publicsoftservice" },
            { "key": "x431paddiagsoftservice.*", "value":"https://my-diag-server.onrender.com/api/v2/diagsoftservice" },
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
            { "key": "publicsoft.download", "value":"https://my-diag-server.onrender.com/api/v2/download" },
            { "key": "downloaddiagsoftws.action", "value":"https://my-diag-server.onrender.com/api/v2/download" },
            { "key": "publicsoft_breakpoint_action", "value":"https://my-diag-server.onrender.com/api/v2/download" },
            { "key": "diagsoft_breakpoint_action", "value":"https://my-diag-server.onrender.com/api/v2/download"},
            { "key": "dlDiagSoftPack.action", "value":"https://my-diag-server.onrender.com/api/v2/download" },
            { "key": "diagsoftservice.*", "value":"https://my-diag-server.onrender.com/api/v2/diagsoftservice" },
            { "key": "activation", "value": "https://diagboss.ch/api/v2/activation" },
            { "key": "log.upload", "value": `${MY_DOMAIN}/api/v2/log-service-upload` },
            { "key": "report_list", "value": `${MY_DOMAIN}/api/v2/httapi-report-list` },
            { "key": "getAutoCodeByVin", "value": `${MY_DOMAIN}/api/v2/getAutoCodeByVin` },
            { "key": "getAutoEntranceIdByVin", "value": `${MY_DOMAIN}/api/v2/getAutoEntranceIdByVin` },
            { "key": "programfile.download_new", "value":"https://diagboss.ch/api/v2/download-programming" },
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
            { "key": "downloaddocumentws.action", "value":"https://diagboss.ch/api/v2/download-document" },
            { "key": "multipagecomp_html_url", "value": `${MY_DOMAIN}/api/v2/multipagecomp-html-url-new` },
            { "key": "motorCardReg", "value": `${MY_DOMAIN}/api/v2/motorCardReg?` },
            { "key": "getMotorUrlBySn", "value": `${MY_DOMAIN}/api/v2/getMotorUrlBySn?` },
            { "key": "query_adas_product", "value": `${MY_DOMAIN}/api/v2/query-adas-product` },
            { "key": "query_adas_soft_file", "value": `${MY_DOMAIN}/api/v2/query-adas-soft-file` },
            { "key": "query_adas_soft_file_by_id", "value": `${MY_DOMAIN}/api/v2/query-adas-soft-file-by-id` },
            { "key": "adas_soft_file_down_loadurl", "value":"https://diagboss.ch/api/v2/adas-soft-file-down-loadurl" },
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
// 9. مسار البرمجيات والماركات التشخيصية (شامل الأساسيات والماركات كاملة)
app.all('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    
    const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    console.log("Diagsoftservice Request Received:", requestBody);

    let soapMethodName = "queryPDTDiagSoftSubPack";
    let innerResponseContent = "";

    if (requestBody.includes("queryLatestDiagSoftsIncrCdn")) {
        soapMethodName = "queryLatestDiagSoftsIncrCdn";
        innerResponseContent = `<code>0</code><message>success</message><x431PadSoftIncrList>
        
        <!-- الحزم الأساسية ونظام الفحص والـ Demo -->
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
            <versionNo>V10.66</versionNo>
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
            <fileSize>6656601</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1366</softId><softName>Demo (EV)</softName><softPackageID>EV_DEMO</softPackageID><softUpdateTime>2026-03-04 11:01:01</softUpdateTime><versionDetailId>381744</versionDetailId><versionNo>V15.68</versionNo><tab>EV</tab>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>2241856</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1150</softId><softName>DEMO Motor</softName><softPackageID>MT_DEMO</softPackageID><softUpdateTime>2024-11-21 15:26:22</softUpdateTime><versionDetailId>363814</versionDetailId><versionNo>V10.11</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>18979371</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>92</softId><softName>ECUAID</softName><softPackageID>ECUAID</softPackageID><softUpdateTime>2025-12-08 16:02:02</softUpdateTime><versionDetailId>366146</versionDetailId><versionNo>V12.11</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>2590675</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>93</softId><softName>EOBD/OBDII</softName><softPackageID>EOBD2</softPackageID><softUpdateTime>2025-08-14 09:43:52</softUpdateTime><versionDetailId>362272</versionDetailId><versionNo>V23.12</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>89446936</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>9</softId><softName>VINSCAN Service</softName><softPackageID>AUTOSEARCH</softPackageID><softUpdateTime>2025-10-24 10:05:07</softUpdateTime><versionDetailId>365206</versionDetailId><versionNo>V11.15</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>1991767</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1145</softId><softName>VINSCAN Service (HD)</softName><softPackageID>HD_AUTOSEARCH</softPackageID><softUpdateTime>2025-08-06 09:32:58</softUpdateTime><versionDetailId>362469</versionDetailId><versionNo>V10.85</versionNo><tab>HD</tab>
        </x431PadSoftIncr>

        <!-- الماركات الكبرى والمشهورة (تويوتا، هوندا، فورد، أودي، فولكس فاجن، لكزس) -->
        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>150000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1001</softId><softName>Toyota</softName><softPackageID>TOYOTA</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4001</versionDetailId><versionNo>V15.50</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>95000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1002</softId><softName>Honda</softName><softPackageID>HONDA</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4002</versionDetailId><versionNo>V14.20</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>180000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1003</softId><softName>Ford</softName><softPackageID>FORD</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4003</versionDetailId><versionNo>V18.10</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>110000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1004</softId><softName>Audi</softName><softPackageID>AUDI</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4004</versionDetailId><versionNo>V29.16</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>210000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1005</softId><softName>Volkswagen</softName><softPackageID>VW</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4005</versionDetailId><versionNo>V29.30</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>130000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1006</softId><softName>Lexus</softName><softPackageID>LEXUS</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4006</versionDetailId><versionNo>V13.10</versionNo>
        </x431PadSoftIncr>

        <!-- باقي ماركات السيارات -->
        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>9380000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1101</softId><softName>Isuzu</softName><softPackageID>ISUZU</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4010</versionDetailId><versionNo>V10.46</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>116500000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1102</softId><softName>LandRover</softName><softPackageID>LANDROVER</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4011</versionDetailId><versionNo>V10.74</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>26660000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1103</softId><softName>Suzuki</softName><softPackageID>SUZUKI</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4012</versionDetailId><versionNo>V10.50</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>12000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1104</softId><softName>Mazda</softName><softPackageID>HMAZDA</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4013</versionDetailId><versionNo>V10.12</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>24300000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1105</softId><softName>Fiat</softName><softPackageID>BXFIAT</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4014</versionDetailId><versionNo>V10.02</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>8000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1106</softId><softName>Ferrari</softName><softPackageID>FERRARI</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4015</versionDetailId><versionNo>V10.20</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>12000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1107</softId><softName>Daihatsu</softName><softPackageID>DAIHATSU</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4016</versionDetailId><versionNo>V10.24</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>2700000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1108</softId><softName>Daewoo</softName><softPackageID>DAEWOO</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4017</versionDetailId><versionNo>V10.02</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>73000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1109</softId><softName>Renault</softName><softPackageID>RENAULT</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4018</versionDetailId><versionNo>V10.66</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>68000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1110</softId><softName>Seat</softName><softPackageID>SEAT</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4019</versionDetailId><versionNo>V10.20</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>74000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1111</softId><softName>Citroen</softName><softPackageID>CITROEN</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4020</versionDetailId><versionNo>V10.30</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>1030000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1112</softId><softName>Benz</softName><softPackageID>BENZ</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4021</versionDetailId><versionNo>V11.28</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>89000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1113</softId><softName>Kia</softName><softPackageID>KIA</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4022</versionDetailId><versionNo>V10.80</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>98000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1114</softId><softName>Hyundai</softName><softPackageID>HYUNDAI</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4023</versionDetailId><versionNo>V10.70</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>92000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1115</softId><softName>Peugeot</softName><softPackageID>PEUGEOT</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4024</versionDetailId><versionNo>V10.60</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>92000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1116</softId><softName>Nissan</softName><softPackageID>NISSAN</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4025</versionDetailId><versionNo>V10.56</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>81000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1117</softId><softName>GM</softName><softPackageID>GM</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4026</versionDetailId><versionNo>V11.22</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>230000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1118</softId><softName>BMW</softName><softPackageID>BMW</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4027</versionDetailId><versionNo>V10.72</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>80000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1119</softId><softName>Mitsubishi</softName><softPackageID>MITSUBISHI</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4028</versionDetailId><versionNo>V10.48</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>15000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1120</softId><softName>Volvo</softName><softPackageID>VOLVO</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4029</versionDetailId><versionNo>V10.54</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>32000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1121</softId><softName>Subaru</softName><softPackageID>SUBARU</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4030</versionDetailId><versionNo>V10.68</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>40000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1122</softId><softName>Skoda</softName><softPackageID>SKODA</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4031</versionDetailId><versionNo>V10.18</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>138000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1123</softId><softName>Porsche</softName><softPackageID>PORSCHE</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4032</versionDetailId><versionNo>V10.46</versionNo>
        </x431PadSoftIncr>

        <x431PadSoftIncr>
            <diagVehicleType>1</diagVehicleType><fileSize>20000000</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-21</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1124</softId><softName>Opel</softName><softPackageID>OPEL</softPackageID><softUpdateTime>2026-01-15 12:00:00</softUpdateTime><versionDetailId>4033</versionDetailId><versionNo>V10.84</versionNo>
        </x431PadSoftIncr>

        </x431PadSoftIncrList>`;
    } else {
        soapMethodName = "queryPDTDiagSoftSubPack";
        innerResponseContent = `<code>0</code><message>success</message><diagSoftSubPackList><diagSoftSubPack><spfId><softSubPackKey>AUDI_DIV01</softSubPackKey><softPackageId>AUDI</softPackageId><softDesc>Audi</softDesc><spfDesc>This package contains the guided functions of the Audi A1,A2</spfDesc><softId>6</softId><spfNameDesc>Audi Guided function package 1(AUDI A1,A2)</spfNameDesc><vNum>29.16</vNum><fileSize>0</fileSize></diagSoftSubPack></diagSoftSubPackList>`;
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


// 10. خريطة الروابط للتحميل المباشر من GitHub Releases (مكتملة بـ 70 نسخة وهمية)
const fileMap = {
    "362272": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/EOBD2_2312_AR.ZIP",
    "2855": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/EOBD2_2312_AR.ZIP",
    "365206": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/AUTOSEARCH_1115_AR.ZIP",
    "367837": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/BMS_DEMO_1555_AR.ZIP",
    "380901": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/DEMO_1568_AR.ZIP",
    "366146": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/ECUAID_1211_EN.ZIP",
    "4001": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4002": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4003": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4004": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4005": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4006": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4007": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4008": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4009": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4010": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4011": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4012": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4013": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4014": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4015": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4016": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4017": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4018": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4019": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4020": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4021": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4022": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4023": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4024": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4025": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4026": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4027": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4028": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4029": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4030": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4031": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4032": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4033": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4034": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4035": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4036": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4037": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4038": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4039": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4040": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4041": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4042": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4043": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4044": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4045": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4046": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4047": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4048": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4049": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4050": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4051": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4052": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4053": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4054": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4055": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4056": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4057": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4058": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4059": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4060": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4061": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4062": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4063": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4064": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4065": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4066": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4067": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4068": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4069": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP",
    "4070": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP"
};


// 11. مسار التحميل الموحّد (Download Endpoint)
app.get('/api/v2/download', (req, res) => {
    const { versionDetailId, dzCode, serialNo, token } = req.query;

    console.log(`Download request received for versionDetailId: ${versionDetailId}, Serial: ${serialNo}`);

    // البحث عن الرابط أو التحويل التلقائي لرابط الديمو إذا لم يتم العثور عليه
    const fileUrl = fileMap[versionDetailId] || fileMap["580565"];

    if (!fileUrl) {
        console.log(`File not found for versionDetailId: ${versionDetailId}`);
        return res.status(404).json({
            code: 404,
            message: "File not found for this versionDetailId"
        });
    }

    // إعادة توجيه التطبيق مباشرة إلى رابط الملف الخارجي
    return res.redirect(302, fileUrl);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
