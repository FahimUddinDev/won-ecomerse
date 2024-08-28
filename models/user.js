// Import needs things
const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 3,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 2555,
    minlength: 5,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      email: this.email,
      role: this.role,
      name: this.name,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(user);
};

module.exports.User = model("User", userSchema);
module.exports.validate = validateUser;
