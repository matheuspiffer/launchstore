const express = require("express");
const multer = require("../app/middlewares/multer");
const productsController = require("../app/controllers/products");
const searchController = require("../app/controllers/search");
const { onlyUsers } = require("../app/middlewares/session");
const routes = express.Router();

routes.get("/create", onlyUsers, productsController.create);
routes.get("/:id", productsController.show);
routes.get("/:id/edit", onlyUsers, productsController.edit);
routes.post("/", onlyUsers, multer.array("photos", 6), productsController.post);
routes.put("/", onlyUsers, multer.array("photos", 6), productsController.put);
routes.delete("/", onlyUsers, productsController.delete);

//search
routes.get("/products/search", searchController.index);

module.exports = routes;
