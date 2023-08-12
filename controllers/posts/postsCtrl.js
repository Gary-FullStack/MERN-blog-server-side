const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");
const User = require("../../model/User/User");
const Post = require("../../model/Post/Post");
const expressAsyncHandler = require("express-async-handler");

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

// *get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("comments");

  res.status(201).json({
    status: "Hooray",
    message: "You got all the posts",
    posts,
  });
});

// *get a single  post
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.status(201).json({
    status: "Hooray",
    message: "You got the posts",
    post,
  });
});

// *delete single post
exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "Hooray",
    message: "You deleted the heck out of that post",
  });
});

// *update a post
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

//  *like a post
exports.likePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req?.userAuth?._id;

  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }

  //  mongo db operator to check if the user has already liked the post
  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { likes: userId },
    },
    { new: true }
  );

  // if user HAD previous dislike, remove it
  post.dislikes = post.dislikes.filter(
    (dislike) => dislike.toString() !== userId.toString()
  );

  await post.save();
  res.status(201).json({ message: "You liked the post" });
});

//  *dislike a post
exports.dislikePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req?.userAuth?._id;

  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { dislikes: userId },
    },
    { new: true }
  );

  // if user HAD previous like, remove it
  post.likes = post.likes.filter(
    (like) => like.toString() !== userId.toString()
  );

  await post.save();

  res.status(201).json({ message: "You disliked the post" });
});

// * post clapping
exports.claps = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }

  await Post.findByIdAndUpdate(
    id,
    {
      $inc: { claps: 1 },
    },
    { new: true }
  );

  res.status(201).json({ message: "You clapped for the post" });
});

// * post scheduling
exports.schedule = expressAsyncHandler(async (req, res) => {
  //get the payload
  const { scheduledPublish } = req.body;
  const { postId } = req.params;
  //check if postid and scheduledpublished found
  if (!postId || !scheduledPublish) {
    throw new Error("PostID and schedule date are required");
  }
  //Find the post
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found...");
  }
  //check if tjhe user is the author of the post
  if (post.author.toString() !== req.userAuth._id.toString()) {
    throw new Error("You can schedulle your own post ");
  }
  // Check if the scheduledPublish date is in the past
  const scheduleDate = new Date(scheduledPublish);
  const currentDate = new Date();
  if (scheduleDate < currentDate) {
    throw new Error("The scheduled publish date cannot be in the past.");
  }
  //update the post
  post.scheduledPublished = scheduledPublish;
  await post.save();
  res.json({
    status: "success",
    message: "Post scheduled successfully",
    post,
  });
});
