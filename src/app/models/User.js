const db = require("../config/db");
const { hash } = require("bcryptjs");
const Product = require("./Product");
const fs = require("fs");
const Base = require("./Base");
Base.init({ table: "users" });
const User = {
  ...Base,
};

module.exports = User;
