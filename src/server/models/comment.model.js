const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1000,
        trim: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };