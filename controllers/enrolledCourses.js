const User = require("../models/userModel");
const Course = require("../models/courseModel");
const sendMail = require("../utils/mailSender");

// ENROLL IN COURSE
async function enrollCourse(req, res) {
  const userId = req.user.userId;
  const courseId = req.params.courseId;

  try {
    // Check if user is already enrolled in the course
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this course" });
    }

    // Add course to user's enrolledCourses array
    const course = user.enrolledCourses.push(courseId);
    await user.save();

    // Send enrollment email
    const emailText = "You have successfully enrolled in the course!";
    await sendMail.sendEmail(
      req.user.email,
      "Course Enrollment Confirmation",
      emailText
    );

    return res
      .status(200)
      .json({ message: "Course enrolled successfully", course });
  } catch (error) {
    console.error("Error enrolling course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// VIEW ENROLLED COURSES
async function getEnrolledCourses(req, res) {
  const userId = req.user.userId;

  try {
    // Find user by ID and populate enrolledCourses field to get course details
    const user = await User.findById(userId).populate("enrolledCourses");

    return res.status(200).json({ enrolledCourses: user.enrolledCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  enrollCourse,
  getEnrolledCourses,
};
