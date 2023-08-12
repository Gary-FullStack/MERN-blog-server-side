const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../../controllers/posts/postsCtrl");
const isLoggedin = require("../../middlewares/isLoggedin");
const checkAccountVerification = require("../../middlewares/isAcctverified");

const postsRouter = express.Router();

postsRouter.post("/", isLoggedin, checkAccountVerification, createPost);

postsRouter.get("/", getPosts);

postsRouter.get("/:id", getPost);

postsRouter.put("/:id", isLoggedin, updatePost);

postsRouter.delete("/:id", isLoggedin, deletePost);

module.exports = postsRouter;
