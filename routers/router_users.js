const express = require("express");
const User = require("../models/user");
const Joi = require('joi'); 
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");


const nickname_pattern = /^[a-z|A-Z|0-9]+$/; // userId는 알파벳 대소문자 (a~z, A~Z), 숫자(0~9)로 구성

// 로그인/회원가입시 Joi를 통한 검증
const postUserSchema = Joi.object({
    nickname: Joi.string()
        .pattern(new RegExp(nickname_pattern))
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .min(4)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    confirmPassword: Joi.ref('password'),
    
})


//* 회원가입 API
router.post("/", async (req, res) => {

    try{
        const {nickname,password, confirmPassword} = await postUserSchema.validateAsync(req.body);

        if(password !== confirmPassword) {
            res.status(400).send({
                errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다."
            });
            return;  // 여기서 끝남
        }

        if (password.includes(nickname)){
            console.log(err);
            res.status(400).send({
                errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
            });
            return;  // 여기서 끝남
        }

        // const existUsers = await User.find({
        //     $or: [{email}, {nickname}],
        // });

        // if (existUsers.length) {

        //     res.status(400).send({
        //         errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다."
        //     });
        //     return;
        // }

        const existUsers = await User.find({nickname});
        
        if (existUsers.length) {

            res.status(400).send({
                errorMessage: "중복된 닉네임입니다."
            });
            return;
        }

        const user = new User({nickname, password});
        await user.save();

        res.status(201).send();

    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다",
        });
    }
    
});




// 내정보 조회 API (auth- middleware 포함)
router.get("/me", authMiddleware, async (req, res) => {
    // console.log(res.locals);
    const {user} = res.locals;
    res.send({
        user: {
            nickname: user.nickname,
        }
    });
});

module.exports = router;