const asyncHandler = require("express-async-handler");
const Comment = require("../../models/Comment/Comment");
const Post = require("../../model/Post/Post");

// create a comment
exports.createComment = asyncHandler(async (req, res) => {
  // * get the payload
  const { message, author, postId } = req.body;

  // * create the comment
  const comment = await Comment.create({
    message,
    author: req.userAuth?._id,
    postId,
  });

  // * associate the comment with a post
  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment._id },
    },
    { new: true }
  );
});
