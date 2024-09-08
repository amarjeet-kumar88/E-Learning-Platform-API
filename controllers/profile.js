const User = require("../models/userModel");

// GET LOGGED IN USER
const getUser = async (req, res) => {
  try {
    // Get user details from req.user.userId
    const userId = req.user.userId;

    // Find user by userId in the database
    const user = await User.findById(userId).populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined;

    // Return user details
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE USER PROFILE
async function updateProfile(req, res) {
  const userId = req.user.userId;
  const { name, email, profilePicture } = req.body;

  if (!name || !email || !profilePicture) {
    return res.status(404).json({ message: "Please fill all the fields" });
  }

  try {
    // Find user by userId
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile fields
    user.name = name;
    user.email = email;
    user.profilePicture = profilePicture;

    // Save updated user profile
    user = await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE PROFILE
async function deleteProfile(req, res) {
  const userId = req.user.userId;

  try {
    // Find user by userId and delete
    const user = await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "Profile deleted successfully", user });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getUser, updateProfile, deleteProfile };
