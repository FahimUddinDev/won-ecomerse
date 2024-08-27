const { Schema, model } = require("mongoose");

const CartItemSchema = Schema({
  product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  price: Number,
  count: {
    type: Number,
    default: 1,
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports.CartItemSchema = CartItemSchema;
module.exports.CartItem = model("CartItem", CartItemSchema);
