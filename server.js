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

// 2. خريطة توجيه المسارات الكاملة
const fullRoutingResponse = {
    "code": 0,
    "msg": "success",
    "version": "74",
    "area": "2",
    "data": {
        "urls": [
            { "key": "login", "value": https://diagboss.ch/api/v2/login` },
            { "key": "check-token", "value": `${MY_DOMAIN}/api/v2/check-token` },
            { "key": "productservice.*", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "publicsoftservice.*", "value": `${MY_DOMAIN}/api/v2/publicsoftservice` },
            { "key": "publicsoftservice.nt", "value": `${MY_DOMAIN}/api/v2/publicsoftservice-nt` },
            { "key": "x431padpublicsoftservice.*", "value": `${MY_DOMAIN}/api/v2/publicsoftservice` },
            { "key": "x431paddiagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "diagnosticLog.query", "value": `${MY_DOMAIN}/api/v2/diagnosticLog` },
            { "key": "createDiagSoftOrder", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "checkProductToUpgrade", "value": `${MY_DOMAIN}/api/v2/product-service` },
            { "key": "publicsoft.download", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "downloaddiagsoftws.action", "value": `${MY_DOMAIN}/api/v2/download` },
            { "key": "diagsoftservice.*", "value": `${MY_DOMAIN}/api/v2/diagsoftservice` },
            { "key": "activation", "value": `${MY_DOMAIN}/api/v2/activation` },
            { "key": "log.upload", "value": `${MY_DOMAIN}/api/v2/log-service-upload` },
            { "key": "report_list", "value": `${MY_DOMAIN}/api/v2/httapi-report-list` },
            { "key": "programfile.download_new", "value": `${MY_DOMAIN}/api/v2/download-programming` },
            { "key": "td.query-state", "value": `${MY_DOMAIN}/api/v2/td-query-state` },
            { "key": "td.check-locked", "value": "https://diagboss.ch/api/v2/td-check-locked" },
            { "key": "getVersionDetialIds", "value": `${MY_DOMAIN}/api/v2/getVersionDetialIds` }
        ]
    }
};

// 3. مسار تسجيل الدخول
app.all(['/api/v2/login', '/login.action', '/api/v2/user/login'], (req, res) => {
    res.json({
        "code": 0,
        "msg": null,
        "data": {
            "xmpp": { "ip": "jabber.diagzone.com", "port": 5222, "domain": "diagzone.com" },
            "token": "MGtjNDgzMGJUhLMVN4VitXb29qQT09
",
            "user": {
                "user_id": "H21J4WOO",
                "user_name": "979862374489",
                "nick_name": "979862374489",
                "email": "mistery4_ever@mail.ru",
                "roles": "1",
                "reg_zone": "1",
                "country": "IT",
                "nation_id": "237"
            }
        }
    });
});

// 4. معالجة طلب الاستعلام عن الحالة (td-query-state)
app.all('/api/v2/td-query-state', (req, res) => {
    console.log('[API] td-query-state Request Received with body/query:', req.body || req.query);
    res.json({
        "code": 0,
        "message": "OK"
    });
});

// 5. معالجة طلب التحقق من القفل (td-check-locked) الجديد
app.all('/api/v2/td-check-locked', (req, res) => {
    console.log('[API] td-check-locked Request Received with body/query:', req.body || req.query);
    res.json({
        "code": 0,
        "message": "OK",
        "data": {
            "isLocked": false
        }
    });
});

// 6. مسار خدمات المنتجات (Product Service)
app.all('/api/v2/product-service', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getRegisteredProductsForPad46><return><code>0</code><productDTOs><carLicenseTag></carLicenseTag><serialNo>979862374489</serialNo><dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey><pdtCategory>2</pdtCategory></productDTOs></return></ns1:getRegisteredProductsForPad46></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    res.status(200).send(soapResponse);
});

// 7. مسار خدمات البرامج والماركات الشامل
app.all(['/api/v2/publicsoftservice', '/api/v2/publicsoftservice-nt'], (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');

    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:queryLatestPublicSofts><return><code>0</code><message>success</message><x431PadSoftList>
        <!-- الأنظمة الأساسية والخدمات -->
        <x431PadSoft><fileSize>393300</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>873</softId><softName>Firmware</softName><softPackageID>DOWNLOAD</softPackageID><softUpdateTime>2023-03-27 00:00:00</softUpdateTime><versionDetailId>343730</versionDetailId><versionNo>V11.91</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>19084288</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>874</softId><softName>ECUAID</softName><softPackageID>ECUAID</softPackageID><softUpdateTime>2024-01-01 00:00:00</softUpdateTime><versionDetailId>345000</versionDetailId><versionNo>V12.11</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>89547520</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>875</softId><softName>VINSCAN Service</softName><softPackageID>VINSCAN_SERVICE</softPackageID><softUpdateTime>2024-01-01 00:00:00</softUpdateTime><versionDetailId>346000</versionDetailId><versionNo>V11.15</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>68365802</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1015</softId><softName>Diagzone PRO V2</softName><softPackageID>Diagzone_PRO_V2</softPackageID><softUpdateTime>2025-03-08 00:00:00</softUpdateTime><versionDetailId>359645</versionDetailId><versionNo>V2.00.033</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>55784448</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>876</softId><softName>Demo</softName><softPackageID>DEMO</softPackageID><softUpdateTime>2024-01-01 00:00:00</softUpdateTime><versionDetailId>347000</versionDetailId><versionNo>V10.66</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>2306868</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>877</softId><softName>Demo (BMS)</softName><softPackageID>DEMO_BMS</softPackageID><softUpdateTime>2024-01-01 00:00:00</softUpdateTime><versionDetailId>348000</versionDetailId><versionNo>V15.55</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>2306868</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>878</softId><softName>DEMO Motor</softName><softPackageID>DEMO_MOTOR</softPackageID><softUpdateTime>2024-01-01 00:00:00</softUpdateTime><versionDetailId>349000</versionDetailId><versionNo>V10.11</versionNo></x431PadSoft>

        <!-- الماركات والملفات -->
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1101</softId><softName>AUTOSEARCH</softName><softPackageID>AUTOSEARCH</softPackageID><versionDetailId>4001</versionDetailId><versionNo>V10.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>20000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1102</softId><softName>AUSTHOLDEN</softName><softPackageID>AUSTHOLDEN</softPackageID><versionDetailId>4002</versionDetailId><versionNo>V21.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>30000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1103</softId><softName>AUDI</softName><softPackageID>AUDI</softPackageID><versionDetailId>4003</versionDetailId><versionNo>V28.50</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>12000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1104</softId><softName>BXFIAT</softName><softPackageID>BXFIAT</softPackageID><versionDetailId>4004</versionDetailId><versionNo>V10.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>45000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1105</softId><softName>BMW</softName><softPackageID>BMW</softPackageID><versionDetailId>4005</versionDetailId><versionNo>V50.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>48000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1106</softId><softName>BENZ</softName><softPackageID>BENZ</softPackageID><versionDetailId>4006</versionDetailId><versionNo>V49.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1107</softId><softName>BAIC</softName><softPackageID>BAIC</softPackageID><versionDetailId>4007</versionDetailId><versionNo>V15.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1108</softId><softName>CHANGHE</softName><softPackageID>CHANGHE</softPackageID><versionDetailId>4008</versionDetailId><versionNo>V14.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>22000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1109</softId><softName>CHANGCHENG</softName><softPackageID>CHANGCHENG</softPackageID><versionDetailId>4009</versionDetailId><versionNo>V18.30</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>40000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1110</softId><softName>CHANGAN</softName><softPackageID>CHANGAN</softPackageID><versionDetailId>4010</versionDetailId><versionNo>V21.40</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>12000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1111</softId><softName>BXGM</softName><softPackageID>BXGM</softPackageID><versionDetailId>4011</versionDetailId><versionNo>V10.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>25000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1112</softId><softName>DAIHATSU</softName><softPackageID>DAIHATSU</softPackageID><versionDetailId>4012</versionDetailId><versionNo>V16.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>20000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1113</softId><softName>DAEWOO</softName><softPackageID>DAEWOO</softPackageID><versionDetailId>4013</versionDetailId><versionNo>V14.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>28000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1114</softId><softName>CITROEN</softName><softPackageID>CITROEN</softPackageID><versionDetailId>4014</versionDetailId><versionNo>V41.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>25000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1115</softId><softName>CHRYSLER</softName><softPackageID>CHRYSLER</softPackageID><versionDetailId>4015</versionDetailId><versionNo>V33.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1116</softId><softName>EUROPE</softName><softPackageID>EUROPE</softPackageID><versionDetailId>4016</versionDetailId><versionNo>V10.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>8000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1117</softId><softName>EOBD2</softName><softPackageID>EOBD2</softPackageID><versionDetailId>4017</versionDetailId><versionNo>V22.50</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>16000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1118</softId><softName>DONGNAN</softName><softPackageID>DONGNAN</softPackageID><versionDetailId>4018</versionDetailId><versionNo>V11.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>35000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1119</softId><softName>GM</softName><softPackageID>GM</softPackageID><versionDetailId>4019</versionDetailId><versionNo>V46.40</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>14000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1120</softId><softName>FUTIAN</softName><softPackageID>FUTIAN</softPackageID><versionDetailId>4020</versionDetailId><versionNo>V12.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>10000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1121</softId><softName>FLYER</softName><softPackageID>FLYER</softPackageID><versionDetailId>4021</versionDetailId><versionNo>V10.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>30000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1122</softId><softName>FIAT</softName><softPackageID>FIAT</softPackageID><versionDetailId>4022</versionDetailId><versionNo>V31.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>22000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1123</softId><softName>HUACHEN</softName><softPackageID>HUACHEN</softPackageID><versionDetailId>4023</versionDetailId><versionNo>V15.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>42000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1124</softId><softName>HONDA</softName><softPackageID>HONDA</softPackageID><versionDetailId>4024</versionDetailId><versionNo>V48.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>20000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1125</softId><softName>HMAZDA</softName><softPackageID>HMAZDA</softPackageID><versionDetailId>4025</versionDetailId><versionNo>V13.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1126</softId><softName>HAFEI</softName><softPackageID>HAFEI</softPackageID><versionDetailId>4026</versionDetailId><versionNo>V14.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1127</softId><softName>INDIANTATA</softName><softPackageID>INDIANTATA</softPackageID><versionDetailId>4027</versionDetailId><versionNo>V12.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>16000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1128</softId><softName>INDIANMARUTI</softName><softPackageID>INDIANMARUTI</softPackageID><versionDetailId>4028</versionDetailId><versionNo>V12.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>16000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1129</softId><softName>INDIANMAHINDRA</softName><softPackageID>INDIANMAHINDRA</softPackageID><versionDetailId>4029</versionDetailId><versionNo>V12.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>45000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1130</softId><softName>HYUNDAI</softName><softPackageID>HYUNDAI</softPackageID><versionDetailId>4030</versionDetailId><versionNo>V51.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>14000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1131</softId><softName>JINLONG</softName><softPackageID>JINLONG</softPackageID><versionDetailId>4031</versionDetailId><versionNo>V11.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>13000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1132</softId><softName>JIAO</softName><softPackageID>JIAO</softPackageID><versionDetailId>4032</versionDetailId><versionNo>V10.50</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>13000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1133</softId><softName>JACTY</softName><softPackageID>JACTY</softPackageID><versionDetailId>4033</versionDetailId><versionNo>V10.50</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>38000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1134</softId><softName>ISUZU</softName><softPackageID>ISUZU</softPackageID><versionDetailId>4034</versionDetailId><versionNo>V21.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>40000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1135</softId><softName>KIA</softName><softPackageID>KIA</softPackageID><versionDetailId>4035</versionDetailId><versionNo>V44.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1136</softId><softName>KARRY_TY</softName><softPackageID>KARRY_TY</softPackageID><versionDetailId>4036</versionDetailId><versionNo>V11.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>16000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1137</softId><softName>JPISUZU</softName><softPackageID>JPISUZU</softPackageID><versionDetailId>4037</versionDetailId><versionNo>V12.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1138</softId><softName>JOULONG</softName><softPackageID>JOULONG</softPackageID><versionDetailId>4038</versionDetailId><versionNo>V10.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>14000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1139</softId><softName>LIUWEI_TY</softName><softPackageID>LIUWEI_TY</softPackageID><versionDetailId>4039</versionDetailId><versionNo>V10.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1140</softId><softName>LIFAN</softName><softPackageID>LIFAN</softPackageID><versionDetailId>4040</versionDetailId><versionNo>V13.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>35000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1141</softId><softName>LANDROVER</softName><softPackageID>LANDROVER</softPackageID><versionDetailId>4041</versionDetailId><versionNo>V33.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1142</softId><softName>KINGLONGTY</softName><softPackageID>KINGLONGTY</softPackageID><versionDetailId>4042</versionDetailId><versionNo>V10.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>22000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1143</softId><softName>MALAYSIA PROTON</softName><softPackageID>MALAYSIA_PROTON</softPackageID><versionDetailId>4043</versionDetailId><versionNo>V14.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>20000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1144</softId><softName>MALAYSIA PERODUA</softName><softPackageID>MALAYSIA_PERODUA</softPackageID><versionDetailId>4044</versionDetailId><versionNo>V13.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1145</softId><softName>LUXGEN</softName><softPackageID>LUXGEN</softPackageID><versionDetailId>4045</versionDetailId><versionNo>V11.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1146</softId><softName>LUFENG</softName><softPackageID>LUFENG</softPackageID><versionDetailId>4046</versionDetailId><versionNo>V11.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>48000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1147</softId><softName>NISSAN</softName><softPackageID>NISSAN</softPackageID><versionDetailId>4047</versionDetailId><versionNo>V45.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>40000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1148</softId><softName>MITSUBISHI</softName><softPackageID>MITSUBISHI</softPackageID><versionDetailId>4048</versionDetailId><versionNo>V32.40</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>42000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1149</softId><softName>MAZDA</softName><softPackageID>MAZDA</softPackageID><versionDetailId>4049</versionDetailId><versionNo>V41.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>25000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1150</softId><softName>MAXUS</softName><softPackageID>MAXUS</softPackageID><versionDetailId>4050</versionDetailId><versionNo>V13.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>35000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1151</softId><softName>PORSCHE</softName><softPackageID>PORSCHE</softPackageID><versionDetailId>4051</versionDetailId><versionNo>V23.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>30000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1152</softId><softName>PEUGEOT</softName><softPackageID>PEUGEOT</softPackageID><versionDetailId>4052</versionDetailId><versionNo>V44.50</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>28000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1153</softId><softName>OPEL</softName><softPackageID>OPEL</softPackageID><versionDetailId>4053</versionDetailId><versionNo>V34.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1154</softId><softName>NJYWKTY</softName><softPackageID>NJYWKTY</softPackageID><versionDetailId>4054</versionDetailId><versionNo>V10.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>25000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1155</softId><softName>SAAB</softName><softPackageID>SAAB</softPackageID><versionDetailId>4055</versionDetailId><versionNo>V23.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>32000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1156</softId><softName>RENAULT</softName><softPackageID>RENAULT</softPackageID><versionDetailId>4056</versionDetailId><versionNo>V43.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1157</softId><softName>QOROS</softName><softPackageID>QOROS</softPackageID><versionDetailId>4057</versionDetailId><versionNo>V11.00</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>16000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1158</softId><softName>QIRUI_TY</softName><softPackageID>QIRUI_TY</softPackageID><versionDetailId>4058</versionDetailId><versionNo>V11.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1159</softId><softName>SGM</softName><softPackageID>SGM</softPackageID><versionDetailId>4059</versionDetailId><versionNo>V15.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>28000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1160</softId><softName>SEAT</softName><softPackageID>SEAT</softPackageID><versionDetailId>4060</versionDetailId><versionNo>V29.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>17000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1161</softId><softName>SAICROEWE</softName><softPackageID>SAICROEWE</softPackageID><versionDetailId>4061</versionDetailId><versionNo>V12.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>19000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1162</softId><softName>SAICMG</softName><softPackageID>SAICMG</softPackageID><versionDetailId>4062</versionDetailId><versionNo>V13.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>22000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1163</softId><softName>SSANGYONG</softName><softPackageID>SSANGYONG</softPackageID><versionDetailId>4063</versionDetailId><versionNo>V21.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>25000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1164</softId><softName>SPRINTER</softName><softPackageID>SPRINTER</softPackageID><versionDetailId>4064</versionDetailId><versionNo>V22.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1165</softId><softName>SMART</softName><softPackageID>SMART</softPackageID><versionDetailId>4065</versionDetailId><versionNo>V14.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>32000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1166</softId><softName>SKODA</softName><softPackageID>SKODA</softPackageID><versionDetailId>4066</versionDetailId><versionNo>V30.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>35000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1167</softId><softName>USAFORD</softName><softPackageID>USAFORD</softPackageID><versionDetailId>4067</versionDetailId><versionNo>V35.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>55000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1168</softId><softName>TOYOTA</softName><softPackageID>TOYOTA</softPackageID><versionDetailId>4068</versionDetailId><versionNo>V51.20</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>40000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1169</softId><softName>SUZUKI</softName><softPackageID>SUZUKI</softPackageID><versionDetailId>4069</versionDetailId><versionNo>V32.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>38000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1170</softId><softName>SUBARU</softName><softPackageID>SUBARU</softPackageID><versionDetailId>4070</versionDetailId><versionNo>V25.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1171</softId><softName>ZHONGTAI</softName><softPackageID>ZHONGTAI</softPackageID><versionDetailId>4071</versionDetailId><versionNo>V12.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>42000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1172</softId><softName>VW</softName><softPackageID>VW</softPackageID><versionDetailId>4072</versionDetailId><versionNo>V49.30</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>35000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1173</softId><softName>VOLVO</softName><softPackageID>VOLVO</softPackageID><versionDetailId>4073</versionDetailId><versionNo>V41.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1174</softId><softName>VAZ</softName><softPackageID>VAZ</softPackageID><versionDetailId>4074</versionDetailId><versionNo>V15.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>16000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1175</softId><softName>ZZNISSAN</softName><softPackageID>ZZNISSAN</softPackageID><versionDetailId>4075</versionDetailId><versionNo>V12.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>15000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1176</softId><softName>ZHONGXING</softName><softPackageID>ZHONGXING</softPackageID><versionDetailId>4076</versionDetailId><versionNo>V11.10</versionNo></x431PadSoft>
        <x431PadSoft><fileSize>18000000</fileSize><lanId>EN</lanId><serverCurrentTime>2026-08-06</serverCurrentTime><softId>1177</softId><softName>BAIC</softName><softPackageID>BAIC</softPackageID><versionDetailId>4077</versionDetailId><versionNo>V15.10</versionNo></x431PadSoft>

    </x431PadSoftList></return></ns1:queryLatestPublicSofts></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    
    res.status(200).send(soapResponse);
});

// 8. مسار خدمات التشخيص الشامل
app.all('/api/v2/diagsoftservice', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const requestBody = req.body || "";

    // إذا طلب التطبيق قائمة الماركات
    if (requestBody.includes('queryLatestDiagSoftsIncrCdn')) {
        const soapResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ns1:queryLatestDiagSoftsIncrCdn>
<return>
<code>0</code>
<message>success</message>
<x431PadSoftIncrList>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>55740637</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>69</softId><softName>Demo</softName><softPackageID>DEMO</softPackageID><softUpdateTime>2026-03-04 10: 32: 08</softUpdateTime><versionDetailId>380901</versionDetailId><versionNo>V10.66</versionNo></x431PadSoftIncr>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>2305655</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1452</softId><softName>Demo (BMS)</softName><softPackageID>BMS_DEMO</softPackageID><softUpdateTime>2024-05-30 09: 48: 23</softUpdateTime><versionDetailId>367837</versionDetailId><versionNo>V15.55</versionNo></x431PadSoftIncr>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>6656601</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1366</softId><softName>Demo (EV)</softName><softPackageID>EV_DEMO</softPackageID><softUpdateTime>2026-03-04 11: 01: 01</softUpdateTime><versionDetailId>381744</versionDetailId><versionNo>V15.68</versionNo><tab>EV</tab></x431PadSoftIncr>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>2241856</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1150</softId><softName>DEMO Motor</softName><softPackageID>MT_DEMO</softPackageID><softUpdateTime>2024-11-21 15: 26: 22</softUpdateTime><versionDetailId>363814</versionDetailId><versionNo>V10.11</versionNo></x431PadSoftIncr>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>18979371</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>92</softId><softName>ECUAID</softName><softPackageID>ECUAID</softPackageID><softUpdateTime>2025-12-08 16: 02: 02</softUpdateTime><versionDetailId>366146</versionDetailId><versionNo>V12.11</versionNo></x431PadSoftIncr>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>2590675</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>93</softId><softName>EOBD/OBDII</softName><softPackageID>EOBD2</softPackageID><softUpdateTime>2025-08-14 09: 43: 52</softUpdateTime><versionDetailId>362272</versionDetailId><versionNo>V23.12</versionNo></x431PadSoftIncr>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>89446936</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>AR</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>9</softId><softName>VINSCAN Service</softName><softPackageID>AUTOSEARCH</softPackageID><softUpdateTime>2025-10-24 10: 05: 07</softUpdateTime><versionDetailId>365206</versionDetailId><versionNo>V11.15</versionNo></x431PadSoftIncr>
    <x431PadSoftIncr><diagVehicleType>1</diagVehicleType><fileSize>1991767</fileSize><freeUseEndTime>2099-01-01</freeUseEndTime><lanId>EN</lanId><serverCurrentTime>2026-08-09</serverCurrentTime><softApplicableArea>5</softApplicableArea><softId>1145</softId><softName>VINSCAN Service (HD)</softName><softPackageID>HD_AUTOSEARCH</softPackageID><softUpdateTime>2025-08-06 09: 32: 58</softUpdateTime><versionDetailId>362469</versionDetailId><versionNo>V10.85</versionNo><tab>HD</tab></x431PadSoftIncr>
</x431PadSoftIncrList>
</return>
</ns1:queryLatestDiagSoftsIncrCdn>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
        res.status(200).send(soapResponse);
    } 
    // إذا طلب إصدار التطبيق
    else {
        const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getMaxVersionForMobileAppCDN><return><code>0</code><message>success</message><appSoftSoftMaxVersion></appSoftSoftMaxVersion></return></ns1:getMaxVersionForMobileAppCDN></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
        res.status(200).send(soapResponse);
    }
});


// 9. جلب مسارات الـ URLs
app.all(['/', '/api/v2/config', '/api/v2/urls'], (req, res) => {
    res.json(fullRoutingResponse);
});
// مسار التفعيل المخصص
app.all('/api/v2/activation', (req, res) => {
    console.log('[API] Activation Request Received with body/query:', req.body || req.query);
    res.json({
        "code": 0,
        "msg": "OK",
        "data": {
            "activationCode": "bytPLzY0VWRXT1NLbjVRZ0FzOEFSdz09"
        }
    });
});
// مسار تحميل الملفات وتوجيهها إلى GitHub
app.all('/api/v2/download', (req, res) => {
    console.log('[API] Download Request Received for:', req.query || req.body);
    
    // الرابط المباشر لملف DEMO.zip من حسابك على جيت هاب
    const githubFileUrl = 'https://github.com/77665645abohashim-ai/my-diag-server/releases/download/v1.0/DEMO.zip';
    
    // توجيه التطبيق للتحميل من الرابط المباشر
    res.redirect(302, githubFileUrl);
});

// 10. المعالج الشامل لأي مسار فرعي آخر
app.all('*', (req, res) => {
    res.json({
        "code": 0,
        "msg": "success",
        "data": {}
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
