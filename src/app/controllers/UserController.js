const { hash } = require("bcryptjs");
const User = require("../models/User.js");
const Product = require("../models/Product.js");
const Validator = require("../validators/user");
const { formatCep, formatCpfCnpj } = require("../../lib/utils");
const fs = require("fs");

module.exports = {
  registerForm(req, res) {
    return res.render("users/register");
  },
  async show(req, res) {
    try {
      const { user } = req;
      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
      user.cep = formatCep(user.cep);
      return res.render("users/index", { user });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj, cep, address } = req.body;
      password = await hash(password, 8);
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep = cep.replace(/\D/g, "");

      const userId = await User.create({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address,
      });
      req.session.userId = userId;

      return res.redirect("/users");
    } catch (err) {
      console.error(err);
    }
  },
  async update(req, res) {
    try {
      const { user } = req;
      let { name, email, cpf_cnpj, cep, address } = req.body;
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep = cep.replace(/\D/g, "");

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address,
      });

      return res.render("users/index", {
        user: req.body,
        success: "Conta atualizada com sucesso",
      });
    } catch (err) {
      return res.render("users/index", { error: "Algum erro aconteceu" });
    }
  },
  async delete(req, res) {
    try {
      const products = await Product.findAll({
        where: { user_id: req.body.id },
      });
      console.log(products);
      //dos produtos, pegar todas as imagens
      const allFilesPromise = products.map(async (product) => {
        await Product.files(product.id);
      });

      let promiseResults = await Promise.all(allFilesPromise);
      //rodar a remoção do usuário
      await User.delete(req.body.id);
      req.session.destroy();
      //remover as imagens da pasta public
      promiseResults.map((files) => {
        files.map((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (err) {
            console.error(err);
          }
        });
      });
      return res.render("session/login", {
        success: "Conta deletada com sucesso",
      });
    } catch (err) {
      console.error(err);
      return res.render("users/index", {
        error: "Erro ao tentar deletar sua conta",
        user: req.body,
      });
    }
  },
};
