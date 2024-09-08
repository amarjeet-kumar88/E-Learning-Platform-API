const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectCloudinary = require("./config/cloudinaryConnect");
const fileUpload = require("express-fileupload");
const cors = require("cors");

require("dotenv").config();

//database connecting
const dbConnect = require("./config/dbConnection");
dbConnect();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

//fileupload middleware to parse data from files.file
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//route import and mount
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/profile");
const courseRoutes = require("./routes/courses");
const enrolledCoursesRoutes = require("./routes/enrolledCourse");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", enrolledCoursesRoutes);

// default route
app.get("/", (req, res) => {
  res.send("App is running...!");
});

//activate
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is running at port no. ${PORT}`);
});
