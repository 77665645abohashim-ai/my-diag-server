const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v2/download', (req, res) => {
    // يمكن أن يأتي الطلب باسم أو رقم (سواء كان اسمه versionDetailId, id, softName, أو softPackageID)
    const queryParam = req.query.versionDetailId || req.query.id || req.query.name || req.query.softPackageID;
    console.log(`Proxy download request received for query: ${queryParam}`);

    try {
        const rawData = fs.readFileSync(path.join(__dirname, 'softwares.json'), 'utf8');
        const jsonData = JSON.parse(rawData);
        
        const list = jsonData.data?.list || jsonData.list || jsonData.data || [];

        // بحث مرن يشمل الأرقام والأسماء والرموز (يقارن بغض النظر عن حالة الأحرف Upper/Lower case)
        const targetItem = list.find(item => {
            if (!queryParam) return false;
            const q = String(queryParam).trim().toLowerCase();

            return (
                String(item.versionDetailId).toLowerCase() === q ||
                String(item.id).toLowerCase() === q ||
                String(item.softName).toLowerCase() === q ||
                String(item.softPackageID).toLowerCase() === q ||
                String(item.cloudSoftName).toLowerCase() === q
            );
        });

        if (targetItem && (targetItem.downloadLink || targetItem.url)) {
            let cleanUrl = (targetItem.downloadLink || targetItem.url).replace(/\\/g, '');
            console.log(`Streaming file from: ${cleanUrl}`);

            https.get(cleanUrl, (externalRes) => {
                if (externalRes.statusCode !== 200) {
                    console.error(`Failed to fetch file, status code: ${externalRes.statusCode}`);
                    return res.status(502).send('Failed to fetch file from source');
                }

                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename="${targetItem.softName || targetItem.name || 'software'}.zip"`);
                
                externalRes.pipe(res);
            }).on('error', (err) => {
                console.error('Error during file streaming:', err);
                return res.status(500).send('Internal Server Error during download');
            });

        } else {
            console.log(`Item matching "${queryParam}" not found in softwares.json`);
            return res.status(404).send('Download link not found in JSON');
        }
    } catch (error) {
        console.error('Error reading softwares.json for proxy download:', error);
        return res.status(500).send('Internal Server Error');
    }
});




app.post('/api/v2/diagsoftservice', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'softwares.json');
        let softwares = [];

        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(rawData);
            softwares = jsonData.data && jsonData.data.list ? jsonData.data.list : [];
        }

        let itemsXml = '';
        softwares.forEach(item => {
            itemsXml += `
                <x431PadSoftIncr>
                    <diagVehicleType>${item.type || 1}</diagVehicleType>
                    <fileSize>${item.fileSize || 0}</fileSize>
                    <freeUseEndTime>${item.freeUseEndTime || 2104578373}</freeUseEndTime>
                    <lanId>AR</lanId>
                    <serverCurrentTime>${item.serverCurrentTime || 1788959173}</serverCurrentTime>
                    <softApplicableArea>${item.softApplicableAreaId || 5}</softApplicableArea>
                    <softId>${item.softId || 0}</softId>
                    <softName>${item.softName || ''}</softName>
                    <softPackageID>${item.softPackageID || ''}</softPackageID>
                    <softUpdateTime>2026-03-04 10:32:08</softUpdateTime>
                    <versionDetailId>${item.versionDetailId || 0}</versionDetailId>
                    <versionNo>${item.versionNo || 'V1.0'}</versionNo>
                    <url>${item.downloadLink || item.url || ''}</url>
                </x431PadSoftIncr>`;
        });

        const soapResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
        <ns1:queryLatestDiagSoftsIncrCdnResponse xmlns:ns1="https://diagzone.com">
            <return>
                <code>0</code>
                <message>success</message>
                <x431PadSoftIncrList>
                    ${itemsXml}
                </x431PadSoftIncrList>
            </return>
        </ns1:queryLatestDiagSoftsIncrCdnResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.send(soapResponse);
    } catch (error) {
        console.error("Error reading softwares.json:", error);
        res.status(500).send("Server Error reading softwares file");
    }
});

app.post('/api/v2/url-upload', (req, res) => {
    res.json({
        code: 0,
        msg: "success",
        data: {}
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
                {"key": "activation", "value":" https://diagboss.ch/api/v2/activation"},
                {"key": "log.upload", "value": `${serverUrl}/api/v2/log-service-upload`},
                {"key": "report_list", "value":"https://diagboss.ch/api/v2/httapi-report-list"},
                {"key": "getAutoCodeByVin", "value": `${serverUrl}/api/v2/getAutoCodeByVin`},
                {"key": "getAutoEntranceIdByVin", "value": `${serverUrl}/api/v2/getAutoEntranceIdByVin`},
                {"key": "programfile.download_new", "value":"https://diagboss.ch/api/v2/download-programming"},
                {"key": "td.query-state", "value":"https://diagboss.ch/api/v2/td-query-state"},
                {"key": "td.report-state", "value":"https://diagboss.ch/api/v2/td-report-state"},
                {"key": "td.upload-cert", "value":"https://diagboss.ch/api/v2/td-upload-cert"},
                {"key": "td.check-locked", "value":"https://diagboss.ch/api/v2/td-check-locked"},
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
app.post('/api/v2/login', express.urlencoded({ extended: true }), (req, res) => {
    const { app_id, ver, login_key, password, time, type, device_token } = req.body;
    
    console.log("Login Request Received:", { login_key, app_id, ver });

    return res.status(200).json({
        "code": 0,
        "msg": null,
        "data": {
            "xmpp": {
                "ip": "jabber.diagzone.com",
                "port": 5222,
                "domain": "diagzone.com"
            },
            "token": "N0VwSEZML2NIdnRSajRvNXdKai90QT09",
            "user": {
                "user_id": "GBV4NMU5",
                "sex": "1",
                "user_name": login_key || "Udhdozjdidj",
                "nick_name": "Hassan",
                "mobile": "",
                "is_bind_mobile": "0",
                "email": "7766565abohashim@gmail.com",
                "is_bind_email": "0",
                "signature": "",
                "set_face_time": "0",
                "roles": "1",
                "reg_zone": "1",
                "reg_source": "0",
                "is_agree_clause": "0",
                "pub_id": "",
                "face_url": null,
                "is_365": false,
                "tech_status": "-1",
                "country": "MA",
                "province": null,
                "city": null,
                "nation_id": "237"
            },
            "config": null
        }
    });
});

app.post('/api/v2/product-service', express.text({ type: '*/*' }), (req, res) => {
    const requestBody = req.body || "";
    console.log("Received Product Service Request:", requestBody);

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46><return><code>0</code><productDTOs><carLicenseTag></carLicenseTag><serialNo>979862374489</serialNo><dzKey>WpFNRUnQThVAz/lNTGrq3nhN5bmcNSo7Ntdj4fv5pfWUEWWWi2V+xYALPP7K4obNxNLJhoRbCHaObSQJV2s86E+yE6xsvZJL5Z6fYPjbfb6bWI1hL3FkA3qhH50vBAMo7BAslnf7aT1hcVbJRIqWbnIhhLILmZ+h5naRReqc3ZyXP/T0Mx3TJTksXkIE2P9x</dzKey><pdtCategory>2</pdtCategory></productDTOs><productDTOs><carLicenseTag></carLicenseTag><serialNo>989140722496</serialNo><dzKey>NgfpI+Mvntqj2KiEZmVEIH7XofYtj7mqUm7QIcum+iRS7DGNlIfioKgGo5KaPjQipeMoccwg/n6orcrV0Bd+GaKbjfi/m7x3yKniRVhtl3iVmxUmbKpl9J/3K3pDRvNy4M0rlPu/O1too9z+NRqXy2TwBTlXIVgvzRxiNnGChzqEtWnbpG/JDB2S8vkW4d10</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});
app.post('/api/v2/diagnosticLog', express.text({ type: '*/*' }), (req, res) => {
    const requestBody = req.body || "";
    console.log("Received Diagnostic Log Request:", requestBody);

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryDiagnosticLogBasic><return><code>0</code><message>success</message><diagLogBasicDTOList></diagLogBasicDTOList></return></ns1:queryDiagnosticLogBasic></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});
app.post('/api/v2/statistics', express.urlencoded({ extended: true }), (req, res) => {
    const { d_model, imei, mac, version, sid, lat, lon, app_id, token } = req.body;
    console.log("Received Statistics Request:", { d_model, imei, app_id });

    return res.status(200).json({
        "code": 0,
        "msg": null,
        "data": {
            "user_id": 0,
            "bool": "0"
        }
    });
});
app.post('/api/v2/publicsoftservice', express.text({ type: '*/*' }), (req, res) => {
    const requestBody = req.body || "";
    console.log("Received Public Soft Service Request:", requestBody);

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts><return><code>0</code><message>success</message><x431PadSoftList><x431PadSoft><fileSize>68365802</fileSize><lanId>EN</lanId><serverCurrentTime>2026-09-10</serverCurrentTime><softId>1015</softId><softName>Diagzone PRO V2</softName><softPackageID>Diagzone_PRO_V2</softPackageID><softUpdateTime>2025-03-08 00:00:00</softUpdateTime><versionDetailId>359638</versionDetailId><versionNo>V2.00.033</versionNo></x431PadSoft><x431PadSoft><fileSize>327680</fileSize><lanId>EN</lanId><serverCurrentTime>2026-09-10</serverCurrentTime><softId>873</softId><softName>Firmware</softName><softPackageID>DOWNLOAD</softPackageID><softUpdateTime>2022-11-15 00:00:00</softUpdateTime><versionDetailId>341054</versionDetailId><versionNo>V12.00</versionNo></x431PadSoft><x431PadSoft><fileSize>6166636</fileSize><lanId>EN</lanId><serverCurrentTime>2026-09-10</serverCurrentTime><softId>880</softId><softName>VIN Recognition App</softName><softPackageID>VIN_RECOGNITION_APP</softPackageID><softUpdateTime>2024-05-02 00:00:00</softUpdateTime><versionDetailId>354411</versionDetailId><versionNo>V1.01.006</versionNo></x431PadSoft></x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`);
});
app.post('/api/v2/log-service-upload', (req, res) => {
    console.log("Received log/crash report upload request");
    
    return res.status(200).json({
        "code": 0,
        "msg": null,
        "data": ""
    });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
