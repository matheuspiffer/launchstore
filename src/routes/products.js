const express = require('express')
const multer = require('../app/middlewares/multer')
const productsController = require('../app/controllers/products')
const searchController = require('../app/controllers/search')
const routes = express.Router()

routes.get('/create', productsController.create)
routes.get('/:id', productsController.show)
routes.get('/:id/edit', productsController.edit)
routes.post('/', multer.array('photos', 6), productsController.post)
routes.put('/', multer.array('photos', 6), productsController.put)
routes.delete('/', productsController.delete)

//search
routes.get('/products/search', searchController.index)

module.exports = routes