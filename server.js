app.get('/api/v2/urls', (req, res) => {
  console.log('--> [GET] /api/v2/urls called with query:', req.query);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  res.status(200).json({
    code: 0,
    code_str: "0",
    msg: "success",
    message: "success",
    data: {
      urls: [],
      config: {}
    }
  });
});
