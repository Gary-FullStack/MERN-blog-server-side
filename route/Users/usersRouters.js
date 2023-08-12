const express = require("express");
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
} = require("../../controllers/users/UsersCtrl");
const isLoggedin = require("../../middlewares/isLoggedin");

const usersRouter = express.Router();

// register route
usersRouter.post("/register", register);

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

module.exports = usersRouter;
