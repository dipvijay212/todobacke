const dbConfig = require("../database/config/index");
const { Sequelize, DataTypes } = require("sequelize");


const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    port: dbConfig.development.port,
  }
);

// const sequelize = new Sequelize("practice", "root", "Admin@123", {
//   host: "127.0.0.1",
//   dialect: "mysql",
//   port: 3306,
// });
module.exports = sequelize;
