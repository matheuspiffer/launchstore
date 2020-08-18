const crypto = require('crypto');
const User = require('../models/user');
const mailer = require('../../lib/mailer')
module.exports = {
  logout(req, res) {
    req.session.destroy();
    return res.redirect("/");
  },
  loginForm(req, res) {
    return res.render("session/login");
  },
  login(req, res) {
    req.session.userId = req.user.id;
    return res.redirect('/users')
  },
  forgotForm(req, res) {
    return res.render('session/forgot-password')
  },
  async forgot(req, res) {
    //user token
    const user = req.user
    try {
      const token = crypto.randomBytes(20).toString('hex')
      //expires
      let now = new Date()
      now = now.setHours(now.getHours + 1)
      await User.update(user.id, {
        reset_toke: token,
        reset_token_expires: now
      })

      await mailer.sendMail({
        to: user.email,
        from: "No-reply@launchstore.com.br",
        subject: "Recuperação de senha",
        html: `<h2>Perdeu a chave?</h2>
        <p>Não se preocupe, clique no link abaixo para redefinir seua senha</p>
        <p>
          <a href="https://localhost:3000/users/password-reset?token=${token}" target="_blank">
            Recuperar senha
          </a>
        </p>`
      })
      return res.render("session/forgot-password", { success: "Verifique seu email para resetar sua senha" })
    }
    catch (err) {
      console.error(err)
      return res.render('session/forgot-password', {error: "Erro inesperado, tente mais tarde"})
    }

  }
};
