const jwt = require("jsonwebtoken");
const User = require("../model/User/User");

const isLoggedin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    const userId = decoded?.user?.id;

    const user = await User.findById(userId).select("username email role _id");

    req.userAuth = user;

    if (err) {
      const err = new Error("Invalid/expired token");
      next(err);
    } else {
      next();
    }
  });
};

module.exports = isLoggedin;
