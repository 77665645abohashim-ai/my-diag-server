// ==========================================
// مسار خدمات الـ SOAP الموحد (publicsoftservice.nt)
// ==========================================
const handlePublicSoft = (req, res) => {
  console.log(`--> [POST] SOAP Service called on: ${req.path}`);
  console.log('--- BODY RECEIVED ---:', req.body);

  res.set('Content-Type', 'text/xml; charset=utf-8');
  
  // استجابة SOAP شاملة تغطي دالة الدخول ودالة الإصدارات
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://diagzone.com">
  <SOAP-ENV:Body>
    <ns1:userLoginResponse>
      <return>
        <code>0</code>
        <message>success</message>
        <token>M1dYYWhyNHVOY1d5dmFIa1hLenlKUT09</token>
        <serialNo>979862374489</serialNo>
        <user>
          <user_id>H21J4WOO</user_id>
          <user_name>979862374489</user_name>
          <nick_name>979862374489</nick_name>
          <email>user@diagzone.com</email>
          <token>M1dYYWhyNHVOY1d5dmFIa1hLenlKUT09</token>
        </user>
      </return>
    </ns1:userLoginResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`);
};

app.post('/publicsoftservice.nt', handlePublicSoft);
app.post('/api/v2/publicsoftservice.nt', handlePublicSoft);
app.post('/publicsoftservice-nt', handlePublicSoft);
app.post('/api/v2/publicsoftservice-nt', handlePublicSoft);
