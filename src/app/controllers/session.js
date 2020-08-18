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
    //verificar se usuário está cadastrado

    //verificar password

    //colocar usuário no req.session
  },
};
