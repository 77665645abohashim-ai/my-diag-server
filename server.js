app.get('/api/v2/urls', (req, res) => {
  console.log('--> [GET] /api/v2/urls query:', req.query);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  return res.status(200).json({
    code: 0,
    code_str: "0",
    msg: "success",
    message: "success",
    data: {
      config_no: "0",
      hosts: [
        "https://my-diag-server.onrender.com"
      ],
      login: "https://my-diag-server.onrender.com/api/v2/login",
      login_url: "https://my-diag-server.onrender.com/api/v2/login",
      user_login: "https://my-diag-server.onrender.com/api/v2/login",
      product_service: "https://my-diag-server.onrender.com/api/v2/product-service",
      getShopRemindStatus: "https://my-diag-server.onrender.com/api/v2/getShopRemindStatus",
      urls: [
        {
          key: "login",
          url: "https://my-diag-server.onrender.com/api/v2/login"
        },
        {
          key: "product_service",
          url: "https://my-diag-server.onrender.com/api/v2/product-service"
        }
      ],
      config: {
        check_ver: "0",
        show_adv: "0",
        url_upload: "0"
      }
    }
  });
});
