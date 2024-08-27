const router = require("express").Router();
const { signIn, signup } = require("../controllers/userControllers");

router.route("/signup").post(signup);
router.route("/signin").post(signIn);

module.exports = router;
