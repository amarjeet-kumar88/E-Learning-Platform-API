const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  enrollCourse,
  getEnrolledCourses,
} = require("../controllers/enrolledCourses");

// Route to enroll in a course
router.post("/:courseId/enroll", authMiddleware, enrollCourse);

// Route to view enrolled courses
router.get("/enrolled-courses", authMiddleware, getEnrolledCourses);

module.exports = router;
