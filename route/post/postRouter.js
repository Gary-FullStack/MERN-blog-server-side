const express = require("express");
const multer = require("multer");
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
  getPublicPosts,
} = require("../../controllers/posts/postsCtrl");
const isLoggedin = require("../../middlewares/isLoggedin");
const checkAccountVerification = require("../../middlewares/isAcctverified");
const storage = require("../../utility/fileUpload");

const postsRouter = express.Router();

// multer middleware
const upload = multer({ storage });

// create post
postsRouter.post(
  "/",
  isLoggedin,
  upload.single("file"),
  checkAccountVerification,
  createPost
);

// get all posts
postsRouter.get("/", getPosts);

// get a single post
postsRouter.get("/:id", getPost);

// public route get post
postsRouter.get("/public", getPublicPosts);

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
