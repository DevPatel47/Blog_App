const express = require("express");
const {
    createBlog,
    likeBlog,
    editBlog,
    deleteBlog
} = require("../controllers/blog.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/create-blog").post(verifyJWT, createBlog);
router.route("/:blogId/like-blog").post(verifyJWT, likeBlog);
router.route("/:blogId/edit-blog").patch(verifyJWT, editBlog);
router.route("/:blogId/delete-blog").delete(verifyJWT, deleteBlog);

module.exports = router;