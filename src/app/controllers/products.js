const Category = require('../models/category')
const Product = require('../models/product')
const { formatPrice } = require('../../lib/utils')
module.exports = {
    create(req, res) {
        Category.all()
            .then(results => {
                res.render('products/create.html', { categories: results.rows })
            })
            .catch(err => {
                throw new Error(err)
            })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        keys.forEach(key => {
            if (!req.body[key]) {
                res.send('Please fill ' + key)
            }
        })
        let results = await Product.create(req.body)
        const productId = results.rows[0].id
        return res.redirect('/products/' + productId)
    },

    async edit(req, res) {
        const { id } = req.params
        let results = await Product.find(id)
        const product = results.rows[0]
        if (!product) res.send('Product not found')
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        results = await Category.all()
        const categories = results.rows
        return res.render('products/edit', { product, categories })
    },

    async put(req, res) {
        const keys = Object.keys(req.body)
        keys.forEach(key => {
            if (!req.body[key]) {
                res.send('Please fill ' + key)
            }
        })
        req.body.price = req.body.price.replace(/\D/g, "")
        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect('products/' + req.body.id + '/edit')
    },

    async delete(req, res) {
        const { id } = req.body
        await Product.delete(id)
        return res.redirect('/')
    }
}