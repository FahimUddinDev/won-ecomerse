const { Schema, model } = require("mongoose");
const Joi = require("joi");

module.exports.Product = model(
  "Product",
  Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      photo: {
        data: Buffer,
        contentType: String,
      },
    },
    { timeStamp: true }
  )
);

module.exports.validate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(100).max(2000).required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
  });
  return schema.validate(product);
};
