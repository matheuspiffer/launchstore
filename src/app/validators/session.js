const User = require("../models/User");

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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
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
  } catch (err) {
    console.error(err);
  }
}
async function forgot(req, res, next) {
  const { email } = req.body;
  console.log(email);
  try {
    let user = await User.findOne({ where: { email } });
    if (!user)
      return res.render("session/forgot-password", {
        user: req.body,
        error: "Email não cadastrado",
      });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
  }
}

async function reset(req, res, next) {
  //procurar usuário
  const { email, password, passwordRepeat, token } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.render("session/password-reset", {
      user: req.body,
      token,
      error: "usuário não encontrado",
    });
  //ver se a senha bate

  if (password != passwordRepeat) {
    return res.render("session/password-reset", {
      error: "As senhas não são iguais",
      token,
      user: req.body,
    });
  }
  //verificar se o token bate
  if (token != user.reset_token)
    return res.render("session/password-reset", {
      user: req.body,
      token,
      error: "Token inválido, solicite uma nova recuperação de senha",
    });

  //verificar se o token nao expirou
  let now = new Date();
  now = now.setHours(now.getHours());
  if (now > user.reset_token_expires)
    return res.render("session/password-reset", {
      user: req.body,
      token,
      error: "Token expirado, solicite uma nova recuperação de senha",
    });

  req.user = user;
  next();
}
module.exports = { login, forgot, reset };
