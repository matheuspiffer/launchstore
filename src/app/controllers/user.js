const User = require('../models/user.js')
const Validator = require('../validators/user')
const {formatCep, formatCpfCnpj} = require('../../lib/utils')
module.exports = {

    registerForm(req, res) {
       

        return res.render('users/register')
    },
    async show(req, res) {
        const {user} = req
        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)
        return res.render('users/index', {user})
    },  
   async post(req, res) {
        const userId = await User.create(req.body)
        req.session.userId = userId
        return res.redirect('/users')
    },

    async update(req, res){
        
        const {userId: id} = req.session
    }


}