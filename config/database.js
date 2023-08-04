const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("ADD KEY HERE");
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
  }
};

module.exports = connectDB;
