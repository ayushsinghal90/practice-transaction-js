const db = require("../config/db");

async function seed() {
  // create tables
  await db.sequelize.sync({ alter: true });
}

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();
