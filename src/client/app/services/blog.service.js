const { BASE_URL } = require("../../constants.js")

function BlogService() {
    this.host = `${BASE_URL}/blogs`;
};

// Create Blog
BlogService.prototype.createBlog = async function (title, content) {

    try {
        const response = await fetch(`${this.host}/create-blog`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content }),
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        throw error;
    }
};

// Edit Blog
BlogService.prototype.editBlog = async function (blogId, title, content) {

    try {
        const response = await fetch(`${this.host}/${blogId}/edit-blog`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content }),
        });
    } catch (error) {
        console.error("Error editing blog:", error);
        throw error;
    };
};

// Delete Blog
BlogService.prototype.deleteBlog = async function (blogId) {
  try {
    const response = await fetch(`${this.host}/${blogId}/delete-blog`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// Like Blog
BlogService.prototype.likeBlog = async function (blogId) {

    try {
        const response = await fetch(`${this.host}/${blogId}/like-blog`, {
      method: "POST",
      credentials: "include",
    });
    return await response.json();
    } catch (error) {
        console.error("Error liking blog: ", error);
        throw error;
    };
};

module.exports = new BlogService();