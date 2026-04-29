const express = require("express");
const router = express.Router();

const Chat = require("../models/ChatModel");
const { protect } = require("../middleware/authMiddleware");

// ==========================
// CREATE OR ACCESS ONE-TO-ONE CHAT
// ==========================
router.post("/", protect, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: {
        $all: [req.user._id, userId],
      },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      return res.json(chat);
    }

    // create new chat
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json(fullChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// GET ALL CHATS OF USER
// ==========================
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.user._id] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// CREATE GROUP CHAT
// ==========================
router.post("/group", protect, async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name || !users) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (users.length < 2) {
      return res
        .status(400)
        .json({ message: "Group must have at least 2 users" });
    }

    users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// RENAME GROUP CHAT
// ==========================
router.put("/rename", protect, async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.json(updatedChat);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// REMOVE USER FROM GROUP
// ==========================
router.put("/remove", protect, async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.json(updatedChat);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


router.put("/add", protect, async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});