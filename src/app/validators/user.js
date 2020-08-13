const User = require('../models/user')
async function post(req, res, next) {
    const keys = Object.keys(req.body)
    keys.forEach(key => {
        if (!req.body[key]) {
            return res.render('users/register', { error: 'Por favor preencha  todos os campos', user: req.body })
        }
    })
    //hceck if user exists [email, cpf]
    let { email, cpf_cnpj, password, passwordRepeat } = req.body
    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })
    if (user) return res.render('users/register', { error: 'Usuário já cadastrado', user: req.body })
    //check  if password matches

    if (password != passwordRepeat) {
        return res.render('users/register', { error: 'As senhas não são iguais', user: req.body })
    }

    next()
}

module.exports = { post }
