const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const products = require('./app/controllers/products')
const home = require('./app/controllers/home')
const search = require('./app/controllers/search')

//home
routes.get('/', home.index)
//search
routes.get('/products/search', search.index)
//products
routes.get('/products/create', products.create)
routes.get('/products/:id', products.show)
routes.get('/products/:id/edit', products.edit)
routes.post('/products', multer.array('photos', 6), products.post)
routes.put('/products', multer.array('photos', 6), products.put)
routes.delete('/products', products.delete)

// alias
routes.get('/ads/create', (req, res) => {
    return res.redirect('/products/create')
})


module.exports = routes