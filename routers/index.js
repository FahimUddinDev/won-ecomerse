const userRouter = require("./userRoutes");
const categoryRouter = require("./categoryRoutes");
const productRouter = require("./productRoutes");
const cartRouter = require("./cartRoutes");
const profileRouter = require("./profileRoutes");
const paymentRouter = require("./paymentRoutes");
module.exports = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/profile", profileRouter);
};
