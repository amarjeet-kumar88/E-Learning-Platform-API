const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// function to connect db with cloudinary
async function connectCloudinary() {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("cloudinary connected successfully");
  } catch (error) {
    console.log("cloudinary not connected");
  }
}

module.exports = connectCloudinary;
