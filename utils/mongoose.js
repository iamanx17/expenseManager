const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.connect(url);
  console.log("Mongo DB conenction was successful", url);
};

module.exports = connectDB;
