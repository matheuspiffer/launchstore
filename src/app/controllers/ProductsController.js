const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");
const { formatPrice, date } = require("../../lib/utils");
module.exports = {
  async create(req, res) {
    try {
      const categories = await Category.all();
      return res.render("products/create.html", { categories });
    } catch (err) {
      console.err(err);
    }
  },
  async show(req, res) {
    try {
      let results = await Product.find(req.params.id);
      const product = results.rows[0];
      if (!product) return res.send("product not found");
      const { day, hour, minutes, month } = date(product.updated_at);
      product.published = {
        day: `${day}/${month}`,
        hour: `${hour}h${minutes}`,
      };
      product.oldPrice = formatPrice(product.old_price);
      product.price = formatPrice(product.price);

      let files = await Product.files(product.id);
      files = files.map((file) => {
        return {
          ...file,
          address: `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`,
        };
      });
      return res.render("products/show", { product, files });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);
      keys.forEach((key) => {
        if (!req.body[key]) {
          res.send("Please fill " + key);
        }
      });

      if (req.files.length == 0)
        return res.send("Please, choose at least one image");

      let {
        category_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status,
      } = req.body;

      price = price.replace(/\D/g, "");

      const productId = await Product.create({
        category_id,
        user_id: req.session.userId,
        name,
        description,
        old_price: old_price || price,
        price,
        quantity,
        status: status || 1,
      });

      const filesPromises = req.files.map((file) =>
        File.create({ ...file, productId })
      );
      await Promise.all(filesPromises);
      return res.redirect("/products/" + productId + "/edit");
    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      const product = await Product.find(req.params.id);
      if (!product) res.send("Product not found");
      product.old_price = formatPrice(product.old_price);
      product.price = formatPrice(product.price);
      const categories = await Category.all();
      let files = await Product.files(product.id);
      files = files.map((file) => ({
        ...file,
        address: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));
      return res.render("products/edit", { product, categories, files });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);
      keys.forEach((key) => {
        if (!req.body[key] && key != "removed_files") {
          res.send("Please fill " + key);
        }
      });
      if (req.files.length != 0) {
        console.log(req.files);
        const newFilesPromise = req.files.map((file) => {
          File.create({ ...file, productId: req.body.id });
        });
        await Promise.all(newFilesPromise);
      }
      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);
        const removedFilesPromises = removedFiles.map((id) => {
          File.delete(id);
        });
        await Promise.all(removedFilesPromises);
      }
      req.body.price = req.body.price.replace(/\D/g, "");
      if (req.body.old_price != req.body.price) {
        const oldProduct = await Product.find(req.body.id);
        req.body.old_price = oldProduct.rows[0].price;
      }

      await Product.update(req.body.id, {
        category_id: req.body.category_id,
        name: req.body.name,
        description: req.body.description,
        old_price: req.body.old_price,
        price: req.body.price,
        quantity: req.body.quantity,
        status: req.body.status,
      });
      return res.redirect("products/" + req.body.id);
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    await Product.delete(id);
    return res.redirect("/");
  },
};
