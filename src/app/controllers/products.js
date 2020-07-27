const Category = require('../models/category')
const Product = require('../models/product')
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
        results = await Category.all()
        const categories = results.rows

        return res.redirect('/')
    }
}