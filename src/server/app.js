const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

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



try {
  app.listen(process.env.PORT || 8800, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
  process.exit(1);
}
