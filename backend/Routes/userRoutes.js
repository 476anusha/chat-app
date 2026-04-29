const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { registerUser, authUser, getAllUsers } = require("../Controller/userController");
const { protect } = require("../middleware/authMiddleware");

// ==========================
// REGISTER

router.post("/register", upload.single("pic"), registerUser);

// ==========================
// LOGIN
router.post("/login", authUser);

// ==========================
// GET ALL USERS (SEARCH + REGEX)
// ==========================
// GET /api/user?search=aarush
router.get("/", protect, getAllUsers);

// ==========================
// CHAT ROUTE (PROTECTED)
// ==========================
router.get("/chat", protect, (req, res) => {
  res.json({
    message: "Chat data accessed successfully",
    user: req.user,
  });
});

module.exports = router;