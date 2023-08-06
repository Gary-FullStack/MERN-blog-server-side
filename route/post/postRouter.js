const express = require("express");
const { createPost } = require("../../controllers/posts/postsCtrl");
const isLoggedin = require("../../middlewares/isLoggedin");

const postsRouter = express.Router();

postsRouter.post("/", isLoggedin, createPost);

module.exports = postsRouter;
