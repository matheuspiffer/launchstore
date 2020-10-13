const LoadProductsServices = require("../services/loadProductServices");
const User = require("../models/User");
const mailer = require("../../lib/mailer");

const email = (seller, buyer, product) => {
  `<h2>Olá ${seller.name}</h2>
    <p>Você tem um novo pedido de compra</p>
    <p>Produto: ${product.name}</p>
    <p>Preço: ${product.price}</p>
    <p><br/><br/></p>
    <h3>Dados do comprador</h3>
    <p>${buyer.name}</p>
    <p>${buyer.email}</p>
    <p>${buyer.address}</p>
    <p>${buyer.cep}</p>
    <p><br/><br/></p>
    <p><strong>Entre em contato para finalizar a compra</strong></p>
    <p><br/><br/></p>
    <p>Atenciosamente, equipe LaunchStore</p>
    `;
};
module.exports = {
  async post(req, res) {
    try {
      //dados do produto
      console.log(req.body);
      const product = await LoadProductsServices.load("product", {
        where: { id: req.body.id },
      });
      //dados do vendedor
      const seller = await User.findOne({ where: { id: product.user_id } });
      //dados do comprador
      const buyer = await User.findOne({ where: { id: req.session.userId } });
      //enviar email com dados da compra para o vendedor do produto
      await mailer.sendMail({
        to: seller.email,
        from: "no-reply@launchstore.com.br",
        subject: "Novo pedido de compra",
        html: email(seller, buyer, product),
      });
      //notificar o uusário com mensagem de sucesso ou erro

      return res.render("orders/success");
    } catch (err) {
      console.error(err);
      return res.render("orders/error");
    }
  },
};
