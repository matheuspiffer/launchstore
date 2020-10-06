const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");
const LoadProductsService = require("../services/loadProductServices");
module.exports = {
  async index(req, res) {
    try {
      let params = {};
      const { filter, category } = req.query;
      console.log(req.query);
      if (!filter) return res.redirect("/");
      params.filter = filter;
      if (category) params.category = category;
      let products = await Product.search(params);
      const productsPromise = products.map((product) =>
        LoadProductsService.format(product)
      );
      products = await Promise.all(productsPromise);

      const search = {
        term: req.query.filter,
        total: products.length,
      };
      const categories = products
        .map((product) => ({
          id: product.category_id,
          name: product.category_name,
        }))
        .reduce((categoriesFiltered, category) => {
          const found = categoriesFiltered.some((cat) => cat.id == category.id);
          if (!found) {
            categoriesFiltered.push(category);
          }
          return categoriesFiltered;
        }, []);

      return res.render("search/index", { products, search, categories });
    } catch (err) {
      console.log(req.query);
      console.error(err);
    }
  },
};
