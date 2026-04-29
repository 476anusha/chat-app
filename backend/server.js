const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectDB = require("./Config/db");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ==========================
// MIDDLEWARE (ORDER MATTERS)
// ==========================

// 1. CORS FIRST
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 2. BODY PARSERS (VERY IMPORTANT)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. COOKIE PARSER
app.use(cookieParser());

// ==========================
// ROUTES
// ==========================
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// ==========================
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// ==========================
app.use(notFound);
app.use(errorHandler);

// ==========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`server started on port ${PORT}`)
    );
  } catch (err) {
    console.error(err.message);
  }
};

startServer();