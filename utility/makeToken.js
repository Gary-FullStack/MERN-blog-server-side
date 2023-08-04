const jwt = require("jsonwebtoken");

const makeToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, "anykey", {
    expiresIn: "1d",
  });
  return token;
};

module.exports = makeToken;
