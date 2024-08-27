const _ = require("lodash");
const { Product, validate } = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");

module.exports.createProduct = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    const fieldData = _.mapValues(fields, (value) => value[0]);
    if (err) return res.status(400).send("No data found");
    const { error } = validate(
      _.pick(fieldData, ["name", "description", "price", "category", "stock"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product(
      _.pick(fieldData, ["name", "description", "price", "category", "stock"])
    );
    if (files.photo) {
      const data = fs.readFileSync(files.photo[0].filepath);
      if (!data) return res.status(200).send("Problem in file data !");
      product.photo = {
        data: data,
        contentType: files.photo[0].mimetype,
      };

      const result = await product.save();
      return res.status(201).send({
        message: "Product added successfully.",
        data: _.pick(result, [
          "name",
          "_id",
          "description",
          "price",
          "category",
          "stock",
          "photo",
        ]),
      });
    }
  });
};

module.exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).send("No data found");
    const fieldData = _.mapValues(fields, (value) => value[0]);
    const updatedFiled = _.pick(fieldData, [
      "name",
      "description",
      "price",
      "category",
      "stock",
    ]);
    _.assignIn(product, updatedFiled);

    if (files.photo) {
      const data = fs.readFileSync(files.photo[0].filepath);
      if (!data) return res.status(200).send("Problem in file data !");
      product.photo = {
        data: data,
        contentType: files.photo[0].mimetype,
      };

      const result = await product.save();
      return res.status(200).send({
        message: " Updated product added successfully.",
      });
    } else {
      const result = await product.save();
      return res.status(200).send({
        message: " Updated product added successfully.",
      });
    }
  });
};

module.exports.getProducts = async (req, res) => {
  const order = req.query.order === "desc" ? -1 : 1;
  const sortBy = req.query.sortBy ? req.query.sortBy : "createAt";
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const products = await Product.find()
    .select({
      _id: 1,
      name: 1,
      description: 1,
      price: 1,
      category: 1,
      stock: 1,
      photo: 1,
    })
    .populate("category", "name createAt")
    .sort({ [sortBy]: order })
    .limit(limit);
  return res.status(200).send(products);
};

module.exports.getProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId)
    .select({
      _id: 1,
      name: 1,
      description: 1,
      price: 1,
      category: 1,
      stock: 1,
    })
    .populate("category", "name createAt");
  if (!product) return res.status(404).send("No product found!");
  return res.status(200).send(product);
};

module.exports.getPhoto = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId).select({
    photo: 1,
    _id: 0,
  });
  res.set("Content-Type", product.photo.contentType);
  return res.status(200).send(product.photo.data);
};

module.exports.filterProducts = async (req, res) => {
  const order = req.body.order === "desc" ? -1 : 1;
  const sortBy = req.body.sortBy ? req.body.sortBy : "createAt";
  const limit = req.body.limit ? parseInt(req.body.limit) : 10;
  const skip = parseInt(req.body.skip);
  const filters = request.body.filters;
  let args = {};
  for (let key in filters) {
    if (filters[key].length > 0) {
      switch (key) {
        case "price":
          args["price"] = {
            $gte: filters["price"][0],
            $lte: filters["price"][1],
          };
          break;
        case "category":
          args["category"] = { $in: filters["category"] };
          break;
        default:
          break;
      }
    }
  }
  const products = await Product.find(args)
    .select({
      _id: 1,
      name: 1,
      description: 1,
      price: 1,
      category: 1,
      stock: 1,
      photo: 1,
    })
    .populate("category", "name createAt")
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);
  return res.status(200).send(products);
};
