const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  claps,
  schedule,
} = require("../../controllers/posts/postsCtrl");
const isLoggedin = require("../../middlewares/isLoggedin");
const checkAccountVerification = require("../../middlewares/isAcctverified");

const postsRouter = express.Router();

// create post
postsRouter.post("/", isLoggedin, checkAccountVerification, createPost);

// get all posts
postsRouter.get("/", getPosts);

// get a single post
postsRouter.get("/:id", getPost);

// update a post
postsRouter.put("/:id", isLoggedin, updatePost);

// delete a post
postsRouter.delete("/:id", isLoggedin, deletePost);

// like a post
postsRouter.put("/likes/:id", isLoggedin, likePost);

// dislike a post
postsRouter.put("/dislikes/:id", isLoggedin, dislikePost);

// clap a post
postsRouter.put("/claps/:id", isLoggedin, claps);

// schedule a post
postsRouter.put("/schedule/:postId", isLoggedin, schedule);

module.exports = postsRouter;
