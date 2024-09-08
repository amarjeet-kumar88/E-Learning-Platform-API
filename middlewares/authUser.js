function isAdmin(req, res, next) {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden - Admin access required" });
  }

  // Call next middleware or route handler
  next();
}

module.exports = isAdmin;
