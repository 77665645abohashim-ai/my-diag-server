const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// أي طلب POST سيأتي لأي مسار سيتم الرد عليه بالنجاح فوراً
app.all('*', (req, res) => {
    console.log("Incoming Request URL:", req.path);
    console.log("Request Body:", req.body);

    const SERIAL_NUMBER = "979862374489";
    const mockToken = "dz_token_979862374489_session";

    return res.status(200).json({
        code: 0,
        msg: "action success",
        token: mockToken,
        data: {
            token: mockToken,
            access_token: mockToken,
            user: {
                user_id: "10001",
                user_name: "979862374489",
                nick_name: "979862374489",
                token: mockToken,
                user_type: "1",
                status: "1"
            },
            deviceUser: {
                serialNo: SERIAL_NUMBER,
                serial_no: SERIAL_NUMBER,
                serial_number: SERIAL_NUMBER
            },
            loginUser: {
                user_name: "979862374489",
                nick_name: "979862374489"
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
