const { CartItem } = require("../models/cartItem");
const { Profile } = require("../models/profile");
const PaymentSession = require("ssl-commerz-node").PaymentSession;

// initial payment
module.exports.initPayment = async (req, res) => {
  const userId = req.user._id;
  const cartItems = await CartItem.find({ user: userId });
  const profile = await Profile.findOne({ user: userId });
  const { address1, address2, country, state, city, postcode, phone } = profile;
  const totalItem = cartItem.reduce((total, item) => item.count + total, 0);
  const totalAmount = cartItem.reduce(
    (total, item) => item.count * item.price + total,
    0
  );
  const transactionId =
    "_" + Math.random().toString(36).substring(2, 9) + new Date().getTime();
  const payment = new PaymentSession(
    true,
    process.env.STORE_ID,
    process.env.STORE_PASSWORD
  );

  // Set the urls
  payment.setUrls({
    success: "yoursite.com/success", // If payment Succeed
    fail: "yoursite.com/fail", // If payment failed
    cancel: "yoursite.com/cancel", // If user cancel payment
    ipn: "https://won-ecomerse.vercel.app/api/payment/ipn", // SSLCommerz will send http post request in this link
  });

  // Set order details
  payment.setOrderInfo({
    total_amount: totalAmount, // Number field
    currency: "BDT", // Must be three character string
    tran_id: transactionId, // Unique Transaction id
    emi_option: 0, // 1 or 0
    multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
    allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
    emi_max_inst_option: 3, // Max instalment Option
    emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
  });

  // Set customer info
  payment.setCusInfo({
    name: req.user.name,
    email: req.user.email,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postcode,
    country: country,
    phone: phone,
    fax: phone,
  });

  // Set shipping info
  payment.setShippingInfo({
    method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
    num_item: totalItem,
    name: req.user.name,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postcode,
    country: country,
  });

  // Set Product Profile
  payment.setProductInfo({
    product_name: "General",
    product_category: "General",
    product_profile: "general",
  });

  const response = await payment.paymentInit();
  return res.status(200).send(response);
};

module.exports.ipn = async (req, res) => {};
