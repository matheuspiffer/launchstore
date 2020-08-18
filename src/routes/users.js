const express = require('express')
const routes = express.Router()

const sessionController = require('../app/controllers/session')
const userController = require('../app/controllers/user')
const Validator = require('../app/validators/user')

// //LOGIN/LOGOUT
// routes.get('/login', sessionController.loginForm)
// routes.post('/login', sessionController.login)
// routes.post('/logout', sessionController.logout)
// //reset password / forgot
// routes.get('/forgot-password', sessionController.forgotForm)
// routes.get('/password-reset', sessionController.resetForm)
// routes.post('/forgot-password', sessionController.forgot)
// routes.post('/password-reset', sessionController.reset)

// //user register usercontroller
routes.get('/register', userController.registerForm)
routes.post('/register', Validator.post, userController.post)
routes.get('/', Validator.show , userController.show)
routes.put('/', Validator.update,userController.update)
// routes.delete('/', userController.delete)

module.exports = routes