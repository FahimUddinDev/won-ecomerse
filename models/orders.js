const { Schema, model } = require("mongoose");
const { CartItemSchema } = require("./cartItem");

const OrderSchema = Schema({
  cartItems: [CartItemSchema],
  transaction_id: {
    type: String,
    unique: true,
  },
  address: {
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postCode: Number,
    country: String,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Complete"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  SessionKey: String,
});

module.exports.Order = model("Order", OrderSchema);
