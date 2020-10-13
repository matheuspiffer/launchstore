const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");
const LoadProductsServices = require("../services/loadProductServices");
const { formatPrice } = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
      const allProducts = await LoadProductsServices.load("products");
      const lastAdded = allProducts.filter((product, index) =>
        index > 2 ? false : true
      );
      return res.render("home/index", { products: lastAdded });
    } catch (err) {
      console.error(err);
    }
  },
};
