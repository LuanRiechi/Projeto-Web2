const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    status: true,
    token: token,
    userId: user._id,
    contador: user.contador
  });
};

module.exports = createUserToken;