const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const makeToken = require("../../utility/makeToken");

// register controller
exports.register = asyncHandler(
  (exports.register = async (req, res) => {
    // Get user input
    const { username, email, password } = req.body;

    // check if user already exist  in the db
    const user = await User.findOne({ username });
    if (user) {
      throw new Error("Username already exists");
    }
    // register user
    const newUser = new User({
      username,
      email,
      password,
    });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // save the user and return status
    await newUser.save();
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      _id: newUser?._id,
      username: newUser?.username,
      email: newUser?.email,
      role: newUser?.role,
    });
  })
);

// login controller
exports.login = asyncHandler(
  (exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid login credentials");
    }

    // compare password with hashed password
    const isMatched = await bcrypt.compare(password, user?.password);
    if (!isMatched) {
      throw new Error("Invalid login credentials");
    }

    // last login
    user.lastLogin = new Date();
    res.json({
      status: "success",
      email: user?.email,
      _id: user?._id,
      username: user?.username,
      role: user?.role,
      token: makeToken(user),
    });
  })
);

// logged in user views
exports.getProfile = asyncHandler(
  (exports.getProfile = async (req, res, next) => {
    const id = req.userAuth._id;
    const user = await User.findById(id);
    res.json({
      status: "success",
      message: "profile retrieved successfully",
      user,
    });
  })
);
