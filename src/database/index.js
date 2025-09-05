const sequelize = require("../config/database");
const { Sequelize, DataTypes } = require("sequelize");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./models/user")(sequelize, DataTypes);
db.todos = require("./models/todo")(sequelize, DataTypes);
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    await sequelize.sync({ force: false });
    console.log("Database synced.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

syncDatabase();

module.exports = db;
// export default db;
