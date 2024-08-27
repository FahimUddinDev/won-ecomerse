require("dotenv/config");
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.MONGODB_URL_LOCAL, {})
  .then(() => {
    console.log("Connected to mongo db!");
  })
  .catch((error) => console.error("Mongodb Connection failed!"));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App running on ${port} port.`);
});
