const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "03a675e21a928c",
      pass: "61f19c5fb2188e"
    }
  });

  module.exports = transport