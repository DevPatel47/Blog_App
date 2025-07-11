const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { Blog } = require("../models/blog.model");

// Create a new Blog
const createBlog = asyncHandler(async (req, res) => {
  // Destructuring data
  const { title, content } = req.body;
  const userId = req.user._id;

  // Checking if any field is empty
  if ([title, content].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiError(400, "Please provide all required fields"));
  }

  // Checking if the title is in required length
  if (title.length < 5 || title.length > 70) {
    return res
      .status(400)
      .json(
        new ApiError(400, "Blog's title must be between 5 to 70 characters")
      );
  }

  // Checking if content is in required length
  if (content.length < 20 || content.length > 5000) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Blog's content must be between 20 to 5000 characters"
        )
      );
  }

  // Everything's fine, creating a new Blog
  const newBlog = await Blog.create({
    title,
    content,
    authorId: userId,
  });

  // Making sure blog is created and sending response
  const createdBlog = await Blog.findById(newBlog._id);

  if (!createdBlog) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while creating blog"));
  }

  return res.status(201).json(
    new ApiResponse(201, "Blog created successfully", {
      blog: createdBlog,
    })
  );
});

// Like a Blog
const likeBlog = asyncHandler(async (req, res) => {
  // Destructuring data
  const blogId = req.params.blogId;
  const userId = req.user._id;

  // Checking whether the blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(new ApiError(400, "Blog not found"));
  }

  // Checking whether the blog is already liked by the user
  const alreadyLiked = blog.likes.includes(userId);
  if (alreadyLiked) {
    return res.status(400).json(new ApiError(400, "Blog is already liked"));
  }

  // Everything's fine, liking the blog and sending response
  blog.likes.push(userId);
  await blog.save();

  return res.status(200).json(new ApiResponse(200, "Blog liked successfully"));
});

// Delete a Blog
const deleteBlog = asyncHandler(async (req, res) => {
  // Destructuring data
  const blogId = req.params.blogId;
  const userId = req.user._id;

  // Checking whether the blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(new ApiError(400, "Blog not found"));
  }

  // Checking if the user is authorized to delete it or no
  if (blog.authorId.toString() !== userId.toString()) {
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized to delete this blog"));
  }

  // Everything's fine, deleting the blog and sending response
  await blog.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog deleted successfully"));
});

// Editing a blog
const editBlog = asyncHandler(async (req, res) => {
  // Destructuring data
  const { title, content } = req.body;
  const blogId = req.params.blogId;
  const userId = req.user._id;

  // Checking whether the blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(new ApiError(400, "Blog not found"));
  }

  // Checking if the user is authorized to delete it or no
  if (blog.authorId.toString() !== userId.toString()) {
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized to edit this blog"));
  }

  const editedBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $set: {
        title,
        content,
      },
    },
    { new: true }
  );

  if (!editedBlog) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while updating the blog"));
  }

  return res.status(200).json(
    new ApiResponse(200, "Blog updated successfully", {
      editedBlog,
    })
  );
});

// Get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({})
    .populate("authorId", "name email") // only include author's name and email
    .sort({ createdAt: -1 }); // newest first

  if (!blogs || blogs.length === 0) {
    return res
        .status(200)
        .json(new ApiResponse(200, "No blogs found", {
        blogs: [],
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blogs fetched successfully", {
      blogs,
    })
  );
});

module.exports = {
  createBlog,
  likeBlog,
  deleteBlog,
  editBlog,
  getAllBlogs
};
