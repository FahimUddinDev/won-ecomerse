const router = require("express").Router();
const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  getPhoto,
  filterProducts,
} = require("../controllers/productControllers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorized");

router.route("/").post([authorize, admin], createProduct).get(getProducts);
router.route("/:id").put([authorize, admin], updateProduct).get(getProduct);
router.route("/photo/:id").get(getPhoto);
router.route("/filter").post(filterProducts);

module.exports = router;
