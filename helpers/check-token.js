const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ status: false, mensagem: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ status: false, mensagem: "O Token é inválido!" });
  }
};

module.exports = checkToken;
