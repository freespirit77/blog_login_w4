const express = require("express");
// const renders = require('./renders');
const routers = require('./routers'); // 통신을 수행하는 Router 생성
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static("assets"));

// html을 대체하는 ejs 엔진을 설정
// app.set("views", __dirname + "/views");
// app.set("view engine", "ejs");

// 몽고 DB의 스키마 설정
const connect = require("./models");
connect();

app.use("/api", [routers]);    //routers 폴더로 분리할때 
// app.use("/api", express.urlencoded({ extended: false }), router);

app.listen(8080, () => {
  console.log(`listening at http://localhost:${port}`);
});


// 접속 로그 표시
const requestMiddleware = (req, res, next)=> {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}
app.use(requestMiddleware);









