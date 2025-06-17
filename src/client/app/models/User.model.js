class User {
    constructor() {
        this._id = null;
        this.fullName = "";
        this.email = "";
        this.password = "";
        this.profilePicture = "";
        this.createdAt = null;
        this.updatedAt = null;
    }

    static fromData({
        _id = null,
        fullName = "",
        email = "",
        password = "",
        profilePicture = "",
        createdAt = null,
        updatedAt = null,
    } = {}) {
        const user = new User();
        user._id = _id;
        user.fullName = fullName;
        user.email = email;
        user.password = password;
        user.profilePicture = profilePicture;
        user.createdAt = createdAt;
        user.updatedAt = updatedAt;
        return user;
    }

    toJSON() {
        return {
            _id: this._id,
            fullName: this.fullName,
            email: this.email,
            profilePicture: this.profilePicture,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = User;
