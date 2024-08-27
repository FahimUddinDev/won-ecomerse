const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");

module.exports.signup = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  let user = {};
  user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already exist");
  }
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const token = user.generateJWT();

  const result = await user.save();
  console.log(result);
  res.status(201).send({
    message: "Registration successful",
    token: token,
    user: _.pick(result, ["_id", "name", "email"]),
  });
};
module.exports.signIn = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Incorrect email or password!");
  }

  const validate = await bcrypt.compare(req.body.password, user.password);
  if (!validate) return res.status(400).send("Invalid password");

  const token = user.generateJWT();
  return res.status(200).send({
    token,
    message: "Login successfully",
    user: _.pick(user, ["_id", "name", "email"]),
  });
};
