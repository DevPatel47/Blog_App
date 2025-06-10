const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers["authorization"]?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid or expired token");
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new ApiError(401, "Invalid or expired token"));
    }
});

module.exports = { verifyJWT };
