const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// خريطة الروابط للتحميل (قم بتعديل أو إضافة الروابط هنا عند الحاجة)
const fileMap = {
    "4001": "https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1/FILE_DEMO_AR.ZIP"
};

// مسار التحميل الأساسي
app.get('/api/v2/download', (req, res) => {
    const { versionDetailId, serialNo } = req.query;
    console.log(`Download request received for versionDetailId: ${versionDetailId}, Serial: ${serialNo}`);

    const fileUrl = fileMap[versionDetailId] || fileMap["4001"];

    if (!fileUrl) {
        return res.status(404).json({
            code: 404,
            message: "File not found for this versionDetailId"
        });
    }

    return res.redirect(302, fileUrl);
});

// مسار جلب قائمة الماركات والبرمجيات بقراءة ملف softwares.json محلياً
app.get('/api/v2/diagsoftservice', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'softwares.json');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "softwares.json file not found on server" });
        }

        const rawData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(rawData);
        res.json(jsonData);
    } catch (error) {
        res.status(500).json({ error: "Failed to read or parse softwares.json file" });
    }
});
app.post('/api/v2/url-upload', (req, res) => {
    console.log("URL Upload request received:", req.body);
    return res.status(200).json({
        code: 0,
        message: "OK"
    });
});
app.get('/api/v2/urls', (req, res) => {
    const { config_no, app_id } = req.query;
    const serverUrl = "https://my-diag-server.onrender.com";

    // يمكنك استخدام config_no أو app_id إذا كنت تريد تغيير الردود بناءً عليها مستقبلاً

    return res.status(200).json({
        "code": 0,
        "msg": "success",
        "data": {
            "urls": [
                {"key": "login", "value": `${serverUrl}/api/v2/login`},
                {"key": "check-token", "value": `${serverUrl}/api/v2/check-token`},
                {"key": "productservice.*", "value": `${serverUrl}/api/v2/product-service`},
                {"key": "publicsoftservice.*", "value": `${serverUrl}/api/v2/publicsoftservice`},
                {"key": "publicsoftservice.nt", "value": `${serverUrl}/api/v2/publicsoftservice-nt`},
                {"key": "x431padpublicsoftservice.*", "value": `${serverUrl}/api/v2/publicsoftservice`},
                {"key": "x431paddiagsoftservice.*", "value": `${serverUrl}/api/v2/diagsoftservice`},
                {"key": "diagnosticLog.query", "value": `${serverUrl}/api/v2/diagnosticLog`},
                {"key": "createDiagSoftOrder", "value": `${serverUrl}/api/v2/product-service`},
                {"key": "checkProductToUpgrade", "value": `${serverUrl}/api/v2/product-service`},
                {"key": "user.set_base", "value": `${serverUrl}/api/v2/user-set-base`},
                {"key": "user.set_area", "value": `${serverUrl}/api/v2/user-set-area`},
                {"key": "user.get_base_info_car_logo", "value": `${serverUrl}/api/v2/user-get-base-info-car-logo`},
                {"key": "area.get_country_list", "value": `${serverUrl}/api/v2/area-get-country-list`},
                {"key": "userinfo.set_password", "value": `${serverUrl}/api/v2/set-password`},
                {"key": "addRepairShop", "value": `${serverUrl}/api/v2/addRepairShop`},
                {"key": "queryRepairShop", "value": `${serverUrl}/api/v2/queryRepairShop`},
                {"key": "publicsoft.download", "value": `${serverUrl}/api/v2/download`},
                {"key": "downloaddiagsoftws.action", "value": `${serverUrl}/api/v2/download`},
                {"key": "publicsoft_breakpoint_action", "value": `${serverUrl}/api/v2/download`},
                {"key": "diagsoft_breakpoint_action", "value": `${serverUrl}/api/v2/download`},
                {"key": "dlDiagSoftPack.action", "value": `${serverUrl}/api/v2/download`},
                {"key": "diagsoftservice.*", "value": `${serverUrl}/api/v2/diagsoftservice`},
                {"key": "activation", "value": `${serverUrl}/api/v2/activation`},
                {"key": "log.upload", "value": `${serverUrl}/api/v2/log-service-upload`},
                {"key": "report_list", "value": `${serverUrl}/api/v2/httapi-report-list`},
                {"key": "getAutoCodeByVin", "value": `${serverUrl}/api/v2/getAutoCodeByVin`},
                {"key": "getAutoEntranceIdByVin", "value": `${serverUrl}/api/v2/getAutoEntranceIdByVin`},
                {"key": "programfile.download_new", "value": `${serverUrl}/api/v2/download-programming`},
                {"key": "td.query-state", "value": `${serverUrl}/api/v2/td-query-state`},
                {"key": "td.report-state", "value": `${serverUrl}/api/v2/td-report-state`},
                {"key": "td.upload-cert", "value": `${serverUrl}/api/v2/td-upload-cert`},
                {"key": "td.check-locked", "value": `${serverUrl}/api/v2/td-check-locked`},
                {"key": "td2.flasher", "value": `${serverUrl}/api/v2/td2-flasher`},
                {"key": "onlinelic", "value": `${serverUrl}/api/v2/onlinelic`},
                {"key": "pubaccount.pid_byt", "value": `${serverUrl}/api/v2/pid-byt`},
                {"key": "friend.list", "value": `${serverUrl}/api/v2/friend-list`},
                {"key": "user.s_search", "value": `${serverUrl}/api/v2/friend-search`},
                {"key": "recover_password", "value": `${serverUrl}/api/v2/recover-password`},
                {"key": "reg_step_1", "value": `${serverUrl}/api/v2/reg-step1`},
                {"key": "reg_step_2", "value": `${serverUrl}/api/v2/reg-step2`},
                {"key": "reg_step_3", "value": `${serverUrl}/api/v2/reg-step3`},
                {"key": "get_tpmsgun_bingding_devices", "value": `${serverUrl}/api/v2/get-pressure-device-list`},
                {"key": "unbinding_tpmsgun_device", "value": `${serverUrl}/api/v2/delete-pressure-device`},
                {"key": "binding_tpmsgun_device", "value": `${serverUrl}/api/v2/binding-pressure-device`},
                {"key": "sendDiagnosticLog", "value": `${serverUrl}/api/v2/send-diagnostic-log`},
                {"key": "funch_url1", "value": `${serverUrl}/serve/rest/queryHelpDtcDocBycondition`},
                {"key": "funch_url2", "value": `${serverUrl}/serve/rest/queryFunchDocBycondition`},
                {"key": "adas_register_url", "value": `${serverUrl}/api/v2/adas-card-reg`},
                {"key": "adas_get_data_url", "value": `${serverUrl}/api/v2/get-adas-key-by-sn`},
                {"key": "adas_get_data_hd_url", "value": `${serverUrl}/api/v2/get-hdadas-key-by-sn`},
                {"key": "burnquery", "value": `${serverUrl}/api/v2/burnquery`},
                {"key": "burn", "value": `${serverUrl}/api/v2/burn`},
                {"key": "burnstatus", "value": `${serverUrl}/api/v2/burnstatus`},
                {"key": "diagonline_url", "value": `${serverUrl}/api/v2/diagonline`},
                {"key": "diagreq_uploadzip_method", "value": "-kiswb-ziprequest/"},
                {"key": "diagreq_uploadxml_method", "value": "-kiswb-xmlrequest/"},
                {"key": "diagresult_queryjson_method", "value": "-kiswb-zipresponse/"},
                {"key": "diagonline_response_url", "value": `${serverUrl}/api/v2/diagonline-kiswb-zipresponse/`},
                {"key": "diagonline_request_url", "value": `${serverUrl}/api/v2/diagonline-kiswb-ziprequest/`},
                {"key": "uploadECUFile_url", "value": `${serverUrl}/api/v2/diagonline-ecurecordfile`},
                {"key": "onlineArithQuery_url", "value": `${serverUrl}/api/v2/diagonline-gettransdiagdataex`},
                {"key": "onlineArithQuery_new_url", "value": `${serverUrl}/api/v2/diagonline-gettransdiagdataex-new`},
                {"key": "onlineFaultCodeQuery_url", "value": `${serverUrl}/api/v2/diagonline-faultcodequery`},
                {"key": "onlineFaultCodeHelpQuery_url", "value": `${serverUrl}/api/v2/diagonline-faultcodehelpquery`},
                {"key": "onlineFaultCodeQueryWithSys_url", "value": `${serverUrl}/api/v2/diagonline-getdiagsoftdtc`},
                {"key": "onlineFaultCodeHelpQueryWithSys_url", "value": `${serverUrl}/api/v2/diagonline-getdiagsoftdtchelp`},
                {"key": "onlineUploadCarInfo_url", "value": `${serverUrl}/api/v2/diagonline-addcardata`},
                {"key": "get_dtcs_ds_url", "value": `${serverUrl}/api/v2/diagonline-getfaultcodeflow`},
                {"key": "ds_upload_dtcs_ds_url", "value": `${serverUrl}/api/v2/diagonline-uploadfaultcodeflow`},
                {"key": "upload_diag_statistic_url", "value": `${serverUrl}/api/v2/diagonline-softuploadrecord`},
                {"key": "download_multi_files_url", "value": `${serverUrl}/api/v2/diagonline-multi-files`},
                {"key": "query_diagcar_data", "value": `${serverUrl}/api/v2/diagonline-query-diagcar-data-new`},
                {"key": "query_diagcar_data_new", "value": `${serverUrl}/api/v2/diagonline-query-diagcar-data-new`},
                {"key": "haynes", "value": `${serverUrl}/api/v2/haynes`},
                {"key": "europe_web_fca_token_url", "value": `${serverUrl}/api/v2/fca-token`},
                {"key": "europe_web_fca_code_login_url", "value": `${serverUrl}/api/v2/fca-login`},
                {"key": "europe_web_fca_level3auth_url", "value": `${serverUrl}/api/v2/fca-level3auth`},
                {"key": "europe_web_fca_signed_url", "value": `${serverUrl}/api/v2/fca-signedchallenge`},
                {"key": "europe_web_fca_track_url", "value": `${serverUrl}/api/v2/fca-trackresponse`},
                {"key": "uploadEcuProgramData", "value": `${serverUrl}/api/v2/uploadEcuProgramData`},
                {"key": "getConditionDataOnline", "value": `${serverUrl}/api/v2/getConditionDataOnline`},
                {"key": "file.upload", "value": `${serverUrl}/api/v2/file-upload`},
                {"key": "getExpertDataFlow", "value": `${serverUrl}/api/v2/getExpertDataFlow`},
                {"key": "getExpertDataFlow_new", "value": `${serverUrl}/api/v2/getExpertDataFlow-new`},
                {"key": "downloaddocumentws.action", "value": `${serverUrl}/api/v2/download-document`},
                {"key": "multipagecomp_html_url", "value": `${serverUrl}/api/v2/multipagecomp-html-url-new`},
                {"key": "motorCardReg", "value": `${serverUrl}/api/v2/motorCardReg?`},
                {"key": "getMotorUrlBySn", "value": `${serverUrl}/api/v2/getMotorUrlBySn?`},
                {"key": "query_adas_product", "value": `${serverUrl}/api/v2/query-adas-product`},
                {"key": "query_adas_soft_file", "value": `${serverUrl}/api/v2/query_adas_soft_file`},
                {"key": "query_adas_soft_file_by_id", "value": `${serverUrl}/api/v2/query_adas_soft_file_by_id`},
                {"key": "adas_soft_file_down_loadurl", "value": `${serverUrl}/api/v2/adas_soft_file_down_loadurl`},
                {"key": "get_plate_by_vin", "value": `${serverUrl}/Home/HttApi/getPlateByVin?`},
                {"key": "getVersionDetialIds", "value": `${serverUrl}/api/v2/getVersionDetialIds`}
            ],
            "version": "74",
            "area": "2"
        }
    });
});
app.post('/api/v2/publicsoftservice-nt', express.text({ type: '*/*' }), (req, res) => {
    const requestBody = req.body || "";
    
    // يمكنك استخراج الوسائط المرسلة من طلب الـ XML إذا احتجت لمعالجتها ديناميكياً
    console.log("Received SOAP Request:", requestBody);

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getMaxVersionForMobileAppCDN><return><code>0</code><message>success</message><appSoftSoftMaxVersion></appSoftSoftMaxVersion></return></ns1:getMaxVersionForMobileAppCDN></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
