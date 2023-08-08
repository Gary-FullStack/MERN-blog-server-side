const asyncHandler = require("express-async-handler");
const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");

// create a comment
exports.createComment = asyncHandler(async (req, res) => {
  // * get the payload
  const { message, author } = req.body;
  const postId = req.params.postId;

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
      $push: { comment: comment._id },
    },
    { new: true }
  );

  // * send the response
  res.json({
    status: "success",
    message: "comment created successfully",
    comment,
  });
});
