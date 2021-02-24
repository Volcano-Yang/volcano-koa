const { dataBase } = require("./db");

module.exports = {
  environment: "dev",
  port: 3000,
  dataBase,
  security: {
    secretKey: "abcdefg",
    expiresIn: 60 * 60 * 24 * 30,
  },
  host: "http://localhost:3000/",
};
