const Course = require("../models/courseModel");

const cloudinary = require("cloudinary").v2;

// GET COURSES WITH FILTERS
async function getFilteredCourses(req, res) {
  // Extract filtering and pagination parameters from query string
  const { category, level, sortBy, sortOrder, page, limit } = req.query;

  // Define filter object based on provided parameters
  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (level) {
    filter.level = level;
  }

  try {
    // Query courses based on filter
    let query = Course.find(filter);

    // Apply sorting
    if (sortBy && sortOrder) {
      query = query.sort({ [sortBy]: sortOrder });
    }

    // Apply pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const totalCourses = await Course.countDocuments(filter);

    query = query.skip(startIndex).limit(pageSize);

    // Execute query
    const courses = await query;

    // Construct response object with pagination metadata
    const response = {
      totalCourses,
      totalPages: Math.ceil(totalCourses / pageSize),
      currentPage: pageNumber,
      pageSize,
      courses,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// CREATE COURSE
async function createCourse(req, res) {
  try {
    const { title, description, price } = req.body;

    //  fetch image from file
    const thumbnail = req.files.image;
    // console.log(
    //   "data and from req file: ",
    //   title,
    //   description,
    //   price,
    //   thumbnail
    // );

    if (!title || !description || !price || !thumbnail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const supportedType = ["jpg", "jpeg", "png"];
    const fileType = thumbnail.name.split(".")[1].toLowerCase();
    const supportedFile = supportedType.includes(fileType);

    if (!supportedFile) {
      return res.status(400).json({
        success: false,
        message: "Image format not supported",
      });
    }

    const options = {
      folder: "coursesThumbnails",
      resource_type: "image",
    };

    const response = await cloudinary.uploader.upload(
      thumbnail.tempFilePath,
      options,
      (err, result) => {
        if (err) {
          console.log("getting error while uploading image");
          return res.json({
            message: "getting some error while uploading image",
          });
        }
        console.log("image uploaded : ", result);
      }
    );

    // Create a new course
    const course = new Course({
      title: title,
      thumbnail: response.secure_url,
      description: description,
      price: price,
    });

    // Save the course to the database
    await course.save();

    return res
      .status(201)
      .json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET ALL COURSES
const allCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find();

    // Check if any courses were found
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    // Return the list of courses
    res.json({ courses });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET COURSE DETAILS
async function getCourseDetails(req, res) {
  const courseId = req.params.id;

  try {
    // Find course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//   UPDATE COURSE
async function updateCourse(req, res) {
  const courseId = req.params.id;
  const { title, thumbnail, description, price } = req.body;

  try {
    // Find course by ID and update
    let course = await Course.findByIdAndUpdate(
      courseId,
      { title, thumbnail, description, price },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res
      .status(200)
      .json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//   DELETE COURSE
async function deleteCourse(req, res) {
  const courseId = req.params.id;

  try {
    // Find course by ID and delete
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res
      .status(200)
      .json({ message: "Course deleted successfully", course });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getFilteredCourses,
  createCourse,
  allCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
};
