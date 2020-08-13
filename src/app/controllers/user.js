const User = require('../models/user.js')
const Validator = require('../validators/user')
module.exports = {

    registerForm(req, res) {
        return res.render('users/register')
    },
    show(req, res) {
        return res.send('ok')
    },
    post(req, res) {
        const userId = User.create(req.body)

        return res.redirect('/users')
    }


}