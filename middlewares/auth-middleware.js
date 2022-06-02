const jwt = require("jsonwebtoken");
const User = require("../models/user");


module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    // console.log(authorization);
    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer"){
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다"
        });
        return;
    }

    try {
        const {userId} = jwt.verify(tokenValue, "my-secret-key2");
        User.findById(userId).exec().then((user) => {
            res.locals.user = user;  // 이 미들웨어를 사용하는 것은 공통으로 사용할 수 있는 공간에 user정보 넣음
            next();
        });   // promise-then으로
        
    } catch(error) {
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다"
        });
        return;
    }
   
};