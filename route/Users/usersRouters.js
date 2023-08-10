const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  profileViewers,
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

module.exports = usersRouter;
