const express = require("express");
const {
    makeComment,
    updateComment,
    deleteComment,
    getCommentsForBlog
} = require("../controllers/comment.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/:blogId/make-comment").post(verifyJWT, makeComment);
router.route("/:commentId/update-comment").put(verifyJWT, updateComment);
router.route("/:commentId/delete-comment").delete(verifyJWT, deleteComment);
router.route("/:blogId/all-comment").get(getCommentsForBlog);

module.exports = router;