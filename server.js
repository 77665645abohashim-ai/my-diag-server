const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;
// رابط سيرفرك المخصص على Render
const MY_DOMAIN = 'https://my-diag-server.onrender.com';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// 1. تقديم خريطة التوجيه الديناميكية عند طلب الجذر أو طلب الإعدادات
app.all('/', (req, res, next) => {
    // إرجاع قائمة الروابط الشاملة للتطبيق
    return res.json({
        "code": 0,
        "msg": "success",
        "version": "74",
        "area": "2",
        "data": {
            "urls": [
                { "key": "login", "value": `${MY_DOMAIN}/api/v2/login` },
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
                { "key": "activation", "value": `${MY_DOMAIN}/api/v2/activation` },
                { "key": "log.upload", "value": `${MY_DOMAIN}/api/v2/log-service-upload` },
                { "key": "report_list", "value": `${MY_DOMAIN}/api/v2/httapi-report-list` },
                { "key": "getAutoCodeByVin", "value": `${MY_DOMAIN}/api/v2/getAutoCodeByVin` },
                { "key": "getAutoEntranceIdByVin", "value": `${MY_DOMAIN}/api/v2/getAutoEntranceIdByVin` },
                { "key": "programfile.download_new", "value": `${MY_DOMAIN}/api/v2/download-programming` },
                { "key": "td.query-state", "value": `${MY_DOMAIN}/api/v2/td-query-state` },
                { "key": "td.report-state", "value": `${MY_DOMAIN}/api/v2/td-report-state` },
                { "key": "td.upload-cert", "value": `${MY_DOMAIN}/api/v2/td-upload-cert` },
                { "key": "td.check-locked", "value": `${MY_DOMAIN}/api/v2/td-check-locked` },
                { "key": "td2.flasher", "value": `${MY_DOMAIN}/api/v2/td2-flasher` },
                { "key": "onlinelic", "value": `${MY_DOMAIN}/api/v2/onlinelic` },
                { "key": "pubaccount.pid_byt", "value": `${MY_DOMAIN}/api/v2/pid-byt` },
                { "key": "friend.list", "value": `${MY_DOMAIN}/api/v2/friend-list` },
                { "key": "user.s_search", "value": `${MY_DOMAIN}/api/v2/friend-search` },
                { "key": "recover_password", "value": `${MY_DOMAIN}/api/v2/recover-password` },
                { "key": "reg_step_1", "value": `${MY_DOMAIN}/api/v2/reg-step1` },
                { "key": "reg_step_2", "value": `${MY_DOMAIN}/api/v2/reg-step2` },
                { "key": "reg_step_3", "value": `${MY_DOMAIN}/api/v2/reg-step3` },
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
    });
});

// 2. معالجة طلب تسجيل الدخول
app.all('/api/v2/login', (req, res) => {
    console.log('[API] Request to /api/v2/login');
    res.json({
        code: 0,
        msg: "success",
        data: {
            token: "mock_token_9988776655",
            username: "admin"
        }
    });
});

// 3. معالجة طلب استعلام عن الماركات والبرامج (Public Soft Service)
app.all('/api/v2/publicsoftservice', (req, res) => {
    console.log('[API] Request to /api/v2/publicsoftservice');
    res.json({
        code: 0,
        msg: "success",
        data: []
    });
});

// 4. معالجة طلبات المنتجات والتحديثات (Product Service)
app.all('/api/v2/product-service', (req, res) => {
    console.log('[API] Request to /api/v2/product-service');
    res.json({
        code: 0,
        msg: "success",
        data: []
    });
});

// 5. مسار عام للتعامل مع باقي نقاط النهاية الـ 94 لتجنب أي خطأ 404
app.all('/api/v2/*', (req, res) => {
    console.log(`[API CATCH-ALL] Handled request for: ${req.path}`);
    res.json({
        code: 0,
        msg: "success",
        data: {}
    });
});

app.listen(PORT, () => {
    console.log(`Diagnostic Server is running on port ${PORT}`);
});
