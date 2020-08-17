const User = require('../models/user')

function checkAllFields(body){
    const keys = Object.keys(req.body)
    keys.forEach(key => {
        if (!req.body[key]) {
            return{ 
                error: 'Por favor preencha  todos os campos', 
                user: body 
            }
        }
    })
}

async function show(req, res, next) {
    const {userId: id} = req.session
    const user = await User.findOne({where: {id}})
    if(!user) return res.render('user/register', {error: 'usuário não encontrado'})

    req.user = user
    next()
}
async function post(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('users/index', fillAllFields)
    
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

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('users/index', fillAllFields)

    const { id, password} = req.body

    
}

module.exports = { post, show }
