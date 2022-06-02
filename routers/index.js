const express = require("express");
const User = require("../models/user");

const postsRouter = require("./router_posts");
const authRouter = require("./router_auth");
const userRouter = require("./router_users");

const router = express.Router();

router.use('/posts/', [postsRouter]);
router.use('/auth/', [authRouter]);
router.use('/users/', [userRouter]);

module.exports = router;
