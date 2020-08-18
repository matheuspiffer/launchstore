const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8e738a00ad60b3",
      pass: "b02ca9499dd43d"
    }
  });

  module.exports = transport