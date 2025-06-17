class Blog {
    constructor() {
        this._id = null;
        this.title = "";
        this.content = "";
        this.authorId = "";
        this.likes = [];
        this.createdAt = null;
        this.updatedAt = null;
    }

    static fromData({
        _id = null,
        title = "",
        content = "",
        authorId = "",
        likes = [],
        createdAt = null,
        updatedAt = null,
    } = {}) {
        const blog = new Blog();
        blog._id = _id;
        blog.title = title;
        blog.content = content;
        blog.authorId = authorId;
        blog.likes = likes;
        blog.createdAt = createdAt;
        blog.updatedAt = updatedAt;
        return blog;
    }

    toJSON() {
        return {
            _id: this._id,
            title: this.title,
            content: this.content,
            authorId: this.authorId,
            likes: this.likes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = Blog;
