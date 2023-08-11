const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const makeToken = require("../../utility/makeToken");

// *register controller
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

// *login controller
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

// *logged in user view
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

// * block a user
exports.blockUser = asyncHandler(async (req, res) => {
  //  this user will be blocked
  const userIdToBlock = req.params.userIdToBlock;
  const userToBlock = await User.findById(userIdToBlock);
  if (!userToBlock) {
    throw new Error("User not found");
  }
  // this user is the blocker
  const userBlocking = req.userAuth._id;

  // don't block yourself
  if (userIdToBlock.toString() === userBlocking.toString()) {
    throw new Error("You cannot block yourself, duh!");
  }
  // Id the blocker and check if the "blockee" is already blocked
  const currentUser = await User.findById(userBlocking);
  if (currentUser?.blockedUsers.includes(userIdToBlock)) {
    throw new Error("User already blocked");
  }

  // add the new blocked user to the blocking user blockedUsers list
  currentUser?.blockedUsers.push(userIdToBlock);
  await currentUser.save();
  res.json({
    message: "User blocked successfully",
    status: "success",
  });
});

// * unblock a user
exports.unblockUser = asyncHandler(async (req, res) => {
  // this user will be unblocked
  const userIdToUnblock = req.params.userIdToUnblock;
  const userToUnblock = await User.findById(userIdToUnblock);
  if (!userToUnblock) {
    throw new Error("User not found");
  }

  // this user is the unblocker
  const userUnblocking = req.userAuth._id;
  const currentUser = await User.findById(userUnblocking);

  //  check if the "blockee" is already blocked or not
  if (!currentUser?.blockedUsers.includes(userIdToUnblock)) {
    throw new Error("User not blocked");
  }

  // remove the user from the blockedUsers list
  currentUser.blockedUsers = currentUser.blockedUsers.filter(
    (id) => id.toString() !== userIdToUnblock.toString()
  );

  // save the user
  await currentUser.save();
  res.json({
    status: "success",
    message: "User unblocked successfully",
  });
});

// * who viewed my profile
exports.profileViewers = asyncHandler(async (req, res) => {
  //* Find out who it was and display
  const userProfileId = req.params.userProfileId;

  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    throw new Error("User to view his profile not found");
  }

  //*find the current user
  const currentUserId = req.userAuth._id;
  //? Check if user already viewed the profile
  if (userProfile?.profileViewers?.includes(currentUserId)) {
    throw new Error("You have already viewed this profile");
  }
  //*push that to the viewers profile
  userProfile.profileViewers.push(currentUserId);
  await userProfile.save();
  res.json({
    message: "You have successfully viewed that profile",
    status: "success",
  });
});

// * follow a user
exports.followUser = asyncHandler(async (req, res) => {
  // * find out who is who
  const currentUserId = req.userAuth._id;
  const userToFollowId = req.params.userToFollowId;

  // * dont follow yourself
  if (currentUserId.toString() === userToFollowId.toString()) {
    throw new Error("You cannot follow yourself");
  }
  // * add the followed user to the following list
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: { following: userToFollowId },
    },
    { new: true }
  );

  // * add the current user to the followers list
  await User.findByIdAndUpdate(
    userToFollowId,
    {
      $addToSet: { followers: currentUserId },
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "User followed successfully",
  });
});

// * unfollow a user
exports.unfollowUser = asyncHandler(async (req, res) => {
  // * find out who is who
  const currentUserId = req.userAuth._id;
  const userToUnfollowId = req.params.userToUnfollowId;

  // * dont unfollow yourself
  if (currentUserId.toString() === userToUnfollowId.toString()) {
    throw new Error("You cannot unfollow yourself");
  }

  // * remove the unfollowed user from the following list
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToUnfollowId },
    },
    { new: true }
  );

  // * remove the current user from the followers list
  await User.findByIdAndUpdate(
    userToUnfollowId,
    {
      $pull: { followers: currentUserId },
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "User unfollowed successfully",
  });
});
