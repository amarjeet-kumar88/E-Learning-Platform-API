// auth.controller.js
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailSender");

// REGISTER USER HANDLER
async function registerUser(req, res) {
  // Extract user input from request body
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate password strength
    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
      profilePicture: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${name}`,
    });

    // Save the user to the database
    await newUser.save();

    newUser.password = undefined;

    // Send registration email
    const emailText = "Thank you for registering on the E-Learning Platform!";
    await sendMail.sendEmail(email, "Welcome to our platform!", emailText);

    // Return success response
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// function to check if password is strong
function isPasswordStrong(password) {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[^\w\d\s]).{8,}$/;
  return passwordRegex.test(password);
}

// LOGIN USER HANDLER
async function loginUser(req, res) {
  // Extract user input from request body
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set token in cookies
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    user.password = undefined;

    // Return success response with user data and token
    return res
      .status(200)
      .json({ message: "Login successful", user: user, token: token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
