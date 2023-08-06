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
