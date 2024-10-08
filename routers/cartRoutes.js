const router = require("express").Router();
const {
  createCartItem,
  getCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cartItemControllers");
const authorize = require("../middlewares/authorized");

router
  .route("/")
  .post([authorize], createCartItem)
  .get([authorize], getCartItem)
  .put([authorize], updateCartItem);

router.route("/:id").delete([authorize], deleteCartItem);

module.exports = router;
