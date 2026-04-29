const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

// ==========================
// ACCESS OR CREATE ONE-TO-ONE CHAT
// ==========================
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

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
    console.error("Access Chat Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET ALL CHATS
// ==========================
const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.user._id] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (error) {
    console.error("Fetch Chats Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// CREATE GROUP CHAT
// ==========================
const createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name || !users) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (users.length < 2) {
      return res.status(400).json({
        message: "Group must have at least 2 users",
      });
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
    console.error("Group Chat Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// RENAME GROUP CHAT
// ==========================
const renameGroup = async (req, res) => {
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
    console.error("Rename Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// REMOVE USER FROM GROUP
// ==========================
const removeFromGroup = async (req, res) => {
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
    console.error("Remove Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// ADD USER TO GROUP (NEW)
// ==========================
const addToGroup = async (req, res) => {
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

    return res.json(chat);
  } catch (error) {
    console.error("Add User Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup, // ✅ IMPORTANT
};