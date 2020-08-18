const Category = require('../models/category')
const Product = require('../models/product')
const File = require('../models/file')
const { formatPrice, date } = require('../../lib/utils')
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
    async show(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
        if (!product) return res.send('product not found')
        const { day, hour, minutes, month } = date(product.updated_at)
        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutes}`,
        }
        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.files(product.id)
        const files = results.rows.map(file => {
            return {
                ...file,
                address: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
            }
        })
        return res.render('products/show', { product, files })

    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        keys.forEach(key => {
            if (!req.body[key]) {
                res.send('Please fill ' + key)
            }
        })

        if (req.files.length == 0) return res.send('Please, choose at least one image')
        let results = await Product.create(req.body)
        const productId = results.rows[0].id
        const filesPromises = req.files.map(file => File.create({ ...file, productId }))
        await Promise.all(filesPromises)
        return res.redirect('/products/' + productId + '/edit')
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
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            address: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        }))
        return res.render('products/edit', { product, categories, files })
    },

    async put(req, res) {
        const keys = Object.keys(req.body)
        keys.forEach(key => {
            if (!req.body[key] && key != 'removed_files') {
                res.send('Please fill ' + key)
            }
        })
        if (req.files.length != 0) {
            console.log(req.files)
            const newFilesPromise = req.files.map(file => {
                File.create({ ...file, productId: req.body.id })
            })
            await Promise.all(newFilesPromise)
        }
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
            const removedFilesPromises = removedFiles.map(id => { File.delete(id) })
            await Promise.all(removedFilesPromises)
        }
        req.body.price = req.body.price.replace(/\D/g, "")
        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect('products/' + req.body.id)
    },

    async delete(req, res) {
        const { id } = req.body
        await Product.delete(id)
        return res.redirect('/')
    }
}