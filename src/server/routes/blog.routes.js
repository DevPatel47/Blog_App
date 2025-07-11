const express = require("express");
const {
    createBlog,
    likeBlog,
    editBlog,
    deleteBlog,
    getAllBlogs
} = require("../controllers/blog.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/create-blog").post(verifyJWT, createBlog);
router.route("/:blogId/like-blog").post(verifyJWT, likeBlog);
router.route("/:blogId/edit-blog").patch(verifyJWT, editBlog);
router.route("/:blogId/delete-blog").delete(verifyJWT, deleteBlog);
router.route("/").get(getAllBlogs);

module.exports = router;