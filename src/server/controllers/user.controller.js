const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "Something went wrong while generating referesh and access token"
                )
            );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;

    if (
        [fullName, userName, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        return res
            .status(400)
            .json(new ApiError(400, "Please provide all required fields"));
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (existedUser) {
        return res
            .status(409)
            .json(
                new ApiError(
                    409,
                    "User with this email or username already exists"
                )
            );
    }

    const newUser = await User.create({
        userName: userName.toLowerCase(),
        email: email.toLowerCase(),
        fullName,
        password,
    });

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        return res
            .status(500)
            .json(
                new ApiError(500, "Something went wrong while creating user")
            );
    }

    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", {
            user: createdUser,
        })
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;

    if (!userName && !email) {
        return res
            .status(400)
            .json(new ApiError(400, "Username or Email is required"));
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (!user) {
        return res.status(404).json(new ApiError(404, "User does not exist"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res
            .status(401)
            .json(new ApiError(401, "Invalid User Credentails"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "User logged in successfully", {
                user: loggedInUser,
                accessToken,
                refreshToken,
            })
        );
});

const logOutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", "", options)
        .cookie("refreshToken", "", options)
        .json(new ApiResponse(200, "User logged out successfully", {}));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const { newAccessToken, newRefreshToken } =
            await generateAccessAndRefereshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, "Access token refreshed successfully", {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                })
            );
    } catch (error) {
        res.status(401).json(new ApiError(401, "Invalid refresh token"));
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordCorrect) {
        return res.status(401).json(new ApiError(401, "Invalid password"));
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!updatedUser) {
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "Something went wrong while updating password"
                )
            );
    }

    return res.status(200).json(
        new ApiResponse(200, "Password updated successfully", {
            user: updatedUser,
        })
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "User fetched successfully", {
            user: req.user,
        })
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, userName } = req.body;

    if (!fullName || !userName) {
        return res
            .status(400)
            .json(new ApiError(400, "Please provide all required fields"));
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                userName,
            },
        },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        return res
            .status(500)
            .json(
                new ApiError(500, "Something went wrong while updating user")
            );
    }

    return res.status(200).json(
        new ApiResponse(200, "User updated successfully", {
            user,
        })
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const oldUrl = req.user?.avatar;
    const user = await User.findByIdAndDelete(req.user?._id);

    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }

    if (oldUrl) {
        await deleteFromCloudinary(oldUrl);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "User deleted successfully", {}));
});

module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    deleteUser,
};
