const express = require("express");
const isLoggedin = require("../../middlewares/isLoggedin");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../../controllers/comments/commentCtrl");

const commentRouter = express.Router();

//* create a comment
commentRouter.post("/:postId", isLoggedin, createComment);

//* delete a comment
commentRouter.delete("/:id", isLoggedin, deleteComment);

//* update a comment
commentRouter.put("/:id", isLoggedin, updateComment);

module.exports = commentRouter;
