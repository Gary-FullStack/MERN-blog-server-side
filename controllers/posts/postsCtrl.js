const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");
const User = require("../../model/User/User");
const Post = require("../../model/Post/Post");

// *Create the post
exports.createPost = asyncHandler(async (req, res, next) => {
  //* get the data
  const { title, content, categoryId } = req.body;

  //* check if the post exists
  const postFound = await Post.findOne({ title });
  if (postFound) {
    throw new Error("whoa now, that post title already exists");
  }

  //* create the post
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
  });

  //* associate the user with the post
  await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  // *add post to the category
  await Category.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  // *send the response
  res.json({
    status: "success",
    message: "Post created successfully",
    post,
  });
});

// get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("comments");

  res.status(201).json({
    status: "Hooray",
    message: "You got all the posts",
    posts,
  });
});

// get a single  post
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.status(201).json({
    status: "Hooray",
    message: "You got the posts",
    post,
  });
});

// delete single post
exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "Hooray",
    message: "You deleted the heck out of that post",
  });
});

// update a post
exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: "Hooray",
    message: "You updatded the heck out of that post",
  });
});
