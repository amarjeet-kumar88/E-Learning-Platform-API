const express = require("express");
const router = express.Router();

const {
  getUser,
  updateProfile,
  deleteProfile,
} = require("../controllers/profile");
const authMiddleware = require("../middlewares/auth");

router.get("/user", authMiddleware, getUser);
router.put("/user/update", authMiddleware, updateProfile);
router.delete("/user/delete", authMiddleware, deleteProfile);

module.exports = router;
