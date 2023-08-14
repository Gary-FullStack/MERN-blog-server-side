const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  profileViewers,
  followUser,
  unfollowUser,
  forgotPassword,
  resetPassword,
  accountVerifyEmail,
  verifyAccount,
} = require("../../controllers/users/UsersCtrl");
const isLoggedin = require("../../middlewares/isLoggedin");
const storage = require("../../utility/fileUpload");

const usersRouter = express.Router();

const upload = multer({ storage });

// register route
usersRouter.post("/register", upload.single("profilePic"), register);

// login route
usersRouter.post("/login", login);

// fetch profile
usersRouter.get("/profile/", isLoggedin, getProfile);

// block a user
usersRouter.put("/block/:userIdToBlock", isLoggedin, blockUser);

// unblock a user
usersRouter.put("/unblock/:userIdToUnblock", isLoggedin, unblockUser);

// who viewed my profile
usersRouter.get("/profile-Viewer/:userProfileId", isLoggedin, profileViewers);

// follow a user
usersRouter.put("/following/:userToFollowId", isLoggedin, followUser);

// unfollow a user
usersRouter.put("/unfollowing/:userToUnfollowId", isLoggedin, unfollowUser);

// forgot password
usersRouter.post("/forgot-password", forgotPassword);

// reset password
usersRouter.post("/reset-password/:resetToken", resetPassword);

// verify email
usersRouter.put("/account-verification-email", isLoggedin, accountVerifyEmail);

// token from email
usersRouter.put(
  "/account-verification/:verifyToken",
  isLoggedin,
  verifyAccount
);

module.exports = usersRouter;
