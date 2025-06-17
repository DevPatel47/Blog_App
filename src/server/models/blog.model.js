const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: [70, "Title cannot exceed 70 characters"],
        minlength: [5, "Title must be atleast 5 characters long"],
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlength: [20, "Blog's content must be atleast 20 characters long"],
        maxlength: [5000, "Blog's content cannot exceed 5000 characters"],
        trim: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };
