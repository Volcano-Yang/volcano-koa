const { dataBase } = require("./db");
const { security } = require("./security");

module.exports = {
    environment: "dev",
    port: 3000,
    dataBase,
    security,
    host: "http://localhost:3000/",
};
