const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ==========================
// GENERATE TOKEN
// ==========================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ==========================
// CLOUDINARY UPLOAD
// ==========================
const uploadFromBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "chat-app-profiles" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ==========================
// REGISTER USER
// ==========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let pic =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      pic = result.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================
// LOGIN USER
// ==========================
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token,
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================
// GET ALL USERS (SEARCH + REGEX)
// ==========================
const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id }, // exclude logged-in user
    }).select("-password");

    return res.status(200).json(users);

  } catch (error) {
    console.error("Get Users Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  authUser,
  getAllUsers,
};