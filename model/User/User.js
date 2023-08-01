const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      require: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: String,
      default: false,
    },
    accoutLevel: {
      type: String,
      enum: ["noob", "pro", "legend"],
      default: "noob",
    },
    profilePic: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    notificationPreferences: {
      email: { type: String, default: "true" },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "none"],
    },

    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
