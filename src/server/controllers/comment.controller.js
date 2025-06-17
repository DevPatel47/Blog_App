const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { Blog } = require("../models/blog.model");
const { Comment } = require("../models/comment.model");

// Add a comment
const makeComment = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;
  const { content } = req.body;
  const userId = req.user._id;

  // Checking whether the blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(new ApiError(400, "Blog not found"));
  }

  // Checking whether the comment is empty or not
  if (!content || content.trim().length === 0) {
    return res.status(400).json(new ApiError(400, "Comment cannot be empty"));
  }

  // Checking whether the comment is in desired length
  if (content.length < 2 || content.length > 1000) {
    return res
      .status(400)
      .json(new ApiError(400, "Comment must be between 2 to 1000 characters"));
  }

  // Everything's fine, making a comment
  const newComment = await Comment.create({
    content,
    authorId: userId,
    blogId: blogId,
  });

  if (!newComment) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while making the comment"));
  }

  return res.status(201).json(new ApiResponse(201, "Commented successfully"), {
    comment: newComment,
  });
});

// Edit a comment
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const commentId = req.params.commentId;
  const userId = req.user._id;

  // Checking whether the comment is empty or not
  if (!content || content.trim().length === 0) {
    return res.status(400).json(new ApiError(400, "Comment cannot be empty"));
  }

  // Checking whether the comment is in desired length
  if (content.length < 2 || content.length > 1000) {
    return res
      .status(400)
      .json(new ApiError(400, "Comment must be between 2 to 1000 characters"));
  }

  // Fetch the comment
  const comment = await Comment.findById(commentId);

  // If comment does not exists
  if (!comment) {
    return res.status(400).json(new ApiError(400, "Comment not found"));
  }

  // Checking if the user is authorized
  if (comment.authorId.toString() !== userId.toString()) {
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized to edit this comment"));
  }

  // Everything's fine, updating the comment
  comment.content = content.trim();
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment updated successfully"), {
      comment: comment,
    });
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;

  // Fetch the comment
  const comment = await Comment.findById(commentId);

  // If comment does not exists
  if (!comment) {
    return res.status(400).json(new ApiError(400, "Comment not found"));
  }

  // Checking if the user is authorized to delete it or no
  if (comment.authorId.toString() !== userId.toString()) {
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized to delete this comment"));
  }

  // Everything's fine, updating the comment
  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
});

// Get comments
const getCommentsForBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const comments = await Comment.find({ blogId })
    .populate("userId", "userName") // fetch commenter details
    .sort({ createdAt: -1 }); // newest first

  return res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched", { comments }));
});

module.exports = {
  makeComment,
  updateComment,
  deleteComment,
  getCommentsForBlog
};
