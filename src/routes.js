const express = require('express')
const routes = express.Router()
const products = require('./app/controllers/products')
routes.get('/', (req, res) => {
    return res.render('layout.html')
})

routes.get('/products/create', products.create)
routes.get('/products/:id/edit', products.edit)
routes.post('/products', products.post)
routes.put('/products', products.put)
routes.delete('/products', products.delete)

//
routes.get('/ads/create', (req, res) => {
    return res.redirect('/products/create')
})


module.exports = routes