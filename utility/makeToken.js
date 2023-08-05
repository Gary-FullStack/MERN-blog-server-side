const jwt = require("jsonwebtoken");

const makeToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = makeToken;
