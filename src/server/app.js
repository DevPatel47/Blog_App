const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");

dotenv.config({
  path: "../../.env",
});

const app = express();

console.log("Environment Variables:", {
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8800",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Static file serving
app.use(
  "/node_modules",
  express.static(path.join(__dirname, "../../node_modules"))
);
app.use(express.static(path.join(__dirname, "../../dist")));


const userRouter = require("./routes/user.routes.js");
const blogRouter = require("./routes/blog.routes.js");
const commentRouter = require("./routes/comment.routes.js");

// API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);

// Catch-all route to serve the main HTML file
app.get('*name', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8800, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error: ", err);
    });
