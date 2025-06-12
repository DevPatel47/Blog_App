const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
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