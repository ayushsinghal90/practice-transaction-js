const { Sequelize, DataTypes } = require("sequelize");

const database = process.env.DB_DATABSE || "practice_transaction";
const username = process.env.DB_USERNAME || "root";
const password = process.env.DB_PASSWORD || "root";

const connectionObject = {
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_DIALECT || "mysql",
  pool: {
    max: process.env.DB_POOL_MAX | 5,
    min: process.env.DB_POOL_MIN | 1,
    acquire: process.env.DB_POOL_ACQUIRE | 30000,
    idle: process.env.DB_POOL_IDLE | 10000,
  },
};

const sequelize = new Sequelize(database, username, password, connectionObject);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../models/user")(db.sequelize, DataTypes);
db.Account = require("../models/account")(db.sequelize, DataTypes);

db.User.associate(db);
db.Account.associate(db);

module.exports = db;
