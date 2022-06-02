const mongoose = require("mongoose");
const dotenv = require("dotenv"); // nodes.js 서버의 포트, DB관리 정보들을 관리할 수 있게함 
dotenv.config(); // 데이터베이스 세팅 

// const connect = () => {
//   mongoose.connect("mongodb://localhost/shopping-demo", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   });
// };

const connect = () => {
  mongoose.connect(process.env.MONGODB_URI, {
  dbName: "4weeks_hw",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

module.exports = connect;

