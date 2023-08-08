const express = require("express");
const isLoggedin = require("../../middlewares/isLoggedin");
const { createComment } = require("../../controllers/comments/commentCtrl");

const commentRouter = express.Router();

// create single category
commentRouter.post("/:postId", isLoggedin, createComment);

module.exports = commentRouter;
