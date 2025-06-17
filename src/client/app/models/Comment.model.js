class Comment {
    constructor() {
        this._id = null;
        this.content = "";
        this.authorId = "";
        this.blogId = "";
        this.createdAt = null;
        this.updatedAt = null;
    }

    static fromData({
        _id = null,
        content = "",
        authorId = "",
        blogId = "",
        createdAt = null,
        updatedAt = null,
    } = {}) {
        const comment = new Comment();
        comment._id = _id;
        comment.content = content;
        comment.authorId = authorId;
        comment.blogId = blogId;
        comment.createdAt = createdAt;
        comment.updatedAt = updatedAt;
        return comment;
    }

    toJSON() {
        return {
            _id: this._id,
            content: this.content,
            authorId: this.authorId,
            blogId: this.blogId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = Comment;
