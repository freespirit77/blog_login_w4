const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

// **로그인 API : JWT / POST 메소드로 작성 (body에 넘기기 위함)
router.post("/", async (req, res) => {
    const {nickname, password} = req.body;
    const user = await User.findOne({nickname, password}).exec();
    console.log(user);

    if(!user) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요"
        });
        return;
    }

    const token = jwt.sign({userId: user.userId}, "my-secret-key2");
    console.log(token);
    res.send({
        token,
    });

});

module.exports = router;