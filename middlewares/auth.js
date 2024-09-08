// auth.middleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Extract token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

module.exports = authMiddleware;
