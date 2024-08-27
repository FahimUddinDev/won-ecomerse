const router = require("express").Router();
const { initPayment, ipn } = require("../controllers/paymentControllers");
const authorize = require("../middlewares/authorized");

router.route("/").get(authorize, initPayment).post(ipn);

module.exports = router;
