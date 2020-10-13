const express = require("express");
const multer = require("../app/middlewares/multer");
const productsController = require("../app/controllers/ProductsController");
const searchController = require("../app/controllers/SearchController");
const { onlyUsers } = require("../app/middlewares/session");
const Validator = require("../app/validators/product");
const routes = express.Router();
//search
routes.get("/search", searchController.index);

routes.get("/create", onlyUsers, productsController.create);
routes.get("/:id", productsController.show);
routes.get("/:id/edit", onlyUsers, productsController.edit);
routes.post(
  "/",
  onlyUsers,
  multer.array("photos", 6),
  Validator.post,
  productsController.post
);
routes.put(
  "/",
  onlyUsers,
  multer.array("photos", 6),
  Validator.put,
  productsController.put
);
routes.delete("/", onlyUsers, productsController.delete);

module.exports = routes;
