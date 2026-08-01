// ==========================================
// مسار تسجيل الدخول REST (POST /api/v2/login)
// ==========================================
const handleLogin = (req, res) => {
  console.log('--> [POST] /login called');
  console.log('--> Body:', req.body);
  
  // استخراج الرقم التسلسلي، وإن كان فارغاً يتم تعيين رقم افتراضي
  let serialNo = req.body.serialNo || req.body.login_key || req.body.username || req.query.serialNo;
  if (!serialNo || serialNo.trim() === '') {
    serialNo = "979862374489";
  }

  // ضبط الترويسة بشكل صريح
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  res.status(200).json({
    code: 0,
    code_str: "0",
    msg: "success",
    message: "success",
    data: {
      serialNo: serialNo,
      token: "M1dYYWhyNHVOY1d5dmFIa1hLenlKUT09",
      ticket: "M1dYYWhyNHVOY1d5dmFIa1hLenlKUT09",
      dzKey: "qOLwvILVmrmkZVZ18kfqZPuWsNnia+eC/lTWfpSLibS1esVL6NJETa7a7Yjddowo8iWr3t/IV1vTbZBYKl4ZvuEptvGX4kfx3r+bNVNKVVPVe4Z4sZpKVKRsSWHpp9VKzYogHyd2ecwFGuFiEAtRN40rR9VkrhQGhUV5nLh9x5rQfZQeGK68OsJ+VvkMN0ty",
      xmpp: {
        ip: "jabber.diagzone.com",
        port: 5222,
        domain: "diagzone.com"
      },
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
        nation_id: "237",
        token: "M1dYYWhyNHVOY1d5dmFIa1hLenlKUT09"
      },
      config: {}
    }
  });
};

app.post('/api/v2/login', handleLogin);
app.post('/login', handleLogin);
app.post('/api/v2/user/login', handleLogin);
