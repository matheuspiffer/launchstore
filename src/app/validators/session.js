const User = require("../models/user");

const { compare } = require("bcryptjs");

function checkAllFields(body) {
  const keys = Object.keys(body);
  keys.forEach((key) => {
    if (!body[key]) {
      return {
        error: "Por favor preencha  todos os campos",
        user: body,
      };
    }
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.render("session/login", {
      user: req.body,
      error: "usuário não encontrado",
    });

  const passed = await compare(password, user.password);
  if (!passed)
    return res.render("session/login", {
      user: req.body,
      error: "Senha incorreta",
    });

  req.user = user;
  next();
}

module.exports = { login };
