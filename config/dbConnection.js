const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

function dbConnection() {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log("DB not connecting", err);
    });
}

module.exports = dbConnection;
