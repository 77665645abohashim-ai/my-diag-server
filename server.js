const express = require('express');
const app = express();

// 1. إعداد الوسطاء (Middleware) لقراءة مختلف أنواع البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/xml', 'application/xml', 'text/plain'] }));

// دومين السيرفر على Render
const BASE_URL = 'https://my-diag-server.onrender.com';

// ==========================================
// 1. مسار خريطة العناوين (GET & POST /api/v2/urls)
// ==========================================
const handleUrls = (req, res) => {
  console.log(`--> [${req.method}] /api/v2/urls called | Query:`, req.query);
  
  res.status(200).json({
    code: 0,
    msg: "success",
    data: {
      login: `${BASE_URL}/api/v2/login`,
      login_url: `${BASE_URL}/api/v2/login`,
      user_login: `${BASE_URL}/api/v2/login`,
      "publicsoftservice.nt": `${BASE_URL}/publicsoftservice.nt`,
      publicsoftservice_nt: `${BASE_URL}/publicsoftservice.nt`,
      product_service: `${BASE_URL}/api/v2/product-service`,
      getShopRemindStatus: `${BASE_URL}/api/v2/getShopRemindStatus`,
      urls: [
        { key: "login", url: `${BASE_URL}/api/v2/login` },
        { key: "login_url", url: `${BASE_URL}/api/v2/login` },
        { key: "publicsoftservice.nt", url: `${BASE_URL}/publicsoftservice.nt` },
        { key: "publicsoftservice_nt", url: `${BASE_URL}/publicsoftservice.nt` },
        { key: "product_service", url: `${BASE_URL}/api/v2/product-service` }
      ]
    }
  });
};

app.get('/api/v2/urls', handleUrls);
app.post('/api/v2/urls', handleUrls);

// ==========================================
// 2. مسار خدمات الـ SOAP (publicsoftservice.nt)
// ==========================================
const handlePublicSoft = (req, res) => {
  console.log(`--> [POST] publicsoftservice called on path: ${req.path}`);
  console.log('--- SOAP BODY START ---');
  console.log(req.body);
  console.log('--- SOAP BODY END ---');

  res.set('Content-Type', 'text/xml; charset=utf-8');
  
  // استجابة SOAP مرنة تشمل رد النجاح العام ورد الدخول
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
  <SOAP-ENV:Body>
    <ns1:userLoginResponse>
      <return>
        <code>0</code>
        <message>success</message>
        <token>M1dYYWhyNHVOY1d5dmFIa1hLenlKUT09</token>
        <user>
          <user_id>H21J4WOO</user_id>
          <user_name>979862374489</user_name>
          <nick_name>979862374489</nick_name>
          <email>user@diagzone.com</email>
        </user>
      </return>
    </ns1:userLoginResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
};

// تغطية كافة صيغ المسار
app.post('/publicsoftservice.nt', handlePublicSoft);
app.post('/api/v2/publicsoftservice.nt', handlePublicSoft);
app.post('/publicsoftservice-nt', handlePublicSoft);
app.post('/api/v2/publicsoftservice-nt', handlePublicSoft);

// ==========================================
// 3. مسار تسجيل الدخول REST (POST /api/v2/login)
// ==========================================
app.post('/api/v2/login', (req, res) => {
  console.log('--> [POST] /api/v2/login called with payload:', req.body);
  const serialNo = req.body.login_key || req.body.username || "979862374489";
  
  res.status(200).json({
    code: 0,
    msg: null,
    data: {
      xmpp: {
        ip: "jabber.diagzone.com",
        port: 5222,
        domain: "diagzone.com"
      },
      token: "M1dYYWhyNHVOY1d5dmFIa1hLenlKUT09",
      user: {
        user_id: "H21J4WOO",
        sex: "1",
        user_name: serialNo,
        nick_name: serialNo,
        mobile: "",
        is_bind_mobile: "0",
        email: "user@diagzone.com",
        is_bind_email: "0",
        roles: "1",
        reg_zone: "1",
        nation_id: "237"
      },
      config: null
    }
  });
});

// ==========================================
// 4. مسار المنتجات والـ dzKey (POST /api/v2/product-service)
// ==========================================
app.post(['/api/v2/product-service', '/product-service'], (req, res) => {
  console.log('--> [POST] product-service called');
  res.set('Content-Type', 'text/xml; charset=utf-8');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
  <SOAP-ENV:Body>
    <ns1:getRegisteredProductsForPad46Response>
      <return>
        <code>0</code>
        <productDTOs>
          <carLicenseTag></carLicenseTag>
          <serialNo>979862374489</serialNo>
          <dzKey>qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty</dzKey>
          <pdtCategory>2</pdtCategory>
        </productDTOs>
      </return>
    </ns1:getRegisteredProductsForPad46Response>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
});

// ==========================================
// 5. مسار استقبال تقارير الأخطاء (url-upload)
// ==========================================
app.post(['/api/v2/url-upload', '/url-upload'], (req, res) => {
  console.log('--> [POST] url-upload report received:', req.body);
  res.status(200).json({ code: 0, message: "OK" });
});

// ==========================================
// 6. مسار احتياطي عام لالتقاط أي طلبات إضافية
// ==========================================
app.use((req, res) => {
  console.log(`[ANY CATCH-ALL] ${req.method} ${req.url}`);
  res.status(200).json({ code: 0, message: "success" });
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
