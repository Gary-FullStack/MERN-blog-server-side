const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../../controllers/users/usersCtrl");
const isLoggedin = require("../../middlewares/isLoggedin");

const usersRouter = express.Router();

// register route
usersRouter.post("/register", register);

// login route
usersRouter.post("/login", login);

// fetch profile
usersRouter.get("/profile/", isLoggedin, getProfile);

module.exports = usersRouter;
