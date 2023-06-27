const jwt = require("jsonwebtoken");
const User = require("../models/User");

const  checkToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ status: false, mensagem: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const userId = verified.id;
    const user = await User.findOne({ _id: userId });
    if(user){
        req.user = verified;
        next();
    } else{
        res.status(400).json({ status: false, mensagem: "Não existe usuario com esse token" });
        return
    }
  } catch (err) {
    res.status(400).json({ status: false, mensagem: "O Token é inválido!" });
  }
};

module.exports = checkToken;
