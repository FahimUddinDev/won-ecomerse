const _ = require("lodash");
const { CartItem } = require("../models/cartItem");

module.exports.createCartItem = async (req, res) => {
  const {
    price,
    product,
    count = 1,
  } = _.pick(req.body, ["price", "product", "count"]);
  const item = await CartItem.findOne({
    user: req.user._id,
    product: product,
  });
  if (item) res.status(400).send("Item already exist in cart");
  let cartItem = new CartItem({
    product,
    price,
    user: req.user._id,
    count: count,
  });
  const result = await cartItem.save();
  res.status(201).send({
    message: "Cart item added successfully",
    data: result,
  });
};
module.exports.getCartItem = async (req, res) => {
  const cartItem = await CartItem.find({ user: req.user._id })
    .populate("product", "name")
    .populate("user", "name");
  return res.status(200).send(cartItem);
};

module.exports.updateCartItem = async (req, res) => {
  const { _id, count } = _.pick(req.body, ["count", "_id"]);
  const user = req.user._id;
  await CartItem.updateOne({ _id, user }, { count });
  return res.status(200).send("cart update successfully");
};
module.exports.deleteCartItem = async (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  await CartItem.deleteOne({ _id, user: userId });
  return res.status(200).send("Item removed successfully.");
};
