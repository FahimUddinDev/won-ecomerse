const jwt = require("jsonwebtoken");
module.exports = async function (req, res, next) {
  let token = req.header("Authorization");
  if (!token) return res.status(401).send("please provide a token");
  else token = token.split(" ")[1].trim();
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (!decoded) return res.status(401).send("Please provide a valid token!");
  }
};
