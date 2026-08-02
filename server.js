app.get('/api/v2/urls', (req, res) => {
  console.log('--> [GET] /api/v2/urls query:', req.query);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  return res.status(200).json({
    code: 0,
    code_str: "0",
    msg: "success",
    message: "success",
    data: {
      login: "https://my-diag-server.onrender.com/api/v2/login",
      login_url: "https://my-diag-server.onrender.com/api/v2/login",
      user_login: "https://my-diag-server.onrender.com/api/v2/login",
      publicsoftservice.nt: "https://my-diag-server.onrender.com/publicsoftservice.nt",
      publicsoftservice_nt: "https://my-diag-server.onrender.com/publicsoftservice.nt",
      product_service: "https://my-diag-server.onrender.com/api/v2/product-service",
      getShopRemindStatus: "https://my-diag-server.onrender.com/api/v2/getShopRemindStatus",
      urls: [
        { key: "login", url: "https://my-diag-server.onrender.com/api/v2/login" },
        { key: "login_url", url: "https://my-diag-server.onrender.com/api/v2/login" },
        { key: "publicsoftservice.nt", url: "https://my-diag-server.onrender.com/publicsoftservice.nt" },
        { key: "publicsoftservice_nt", url: "https://my-diag-server.onrender.com/publicsoftservice.nt" },
        { key: "product_service", url: "https://my-diag-server.onrender.com/api/v2/product-service" }
      ],
      hosts: [
        "https://my-diag-server.onrender.com"
      ],
      config: {
        check_ver: "0",
        show_adv: "0",
        url_upload: "0"
      }
    }
  });
});
