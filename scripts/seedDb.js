const db = require("../config/db");
const User = db.User;
const Account = db.Account;

async function seed() {
  // create tables
  await db.sequelize.sync({ force: true });

  await Promise.all([
    User.create({
      id: 1,
      firstName: "Harry",
      lastName: "Potter",
      username: "testuser",
      email: "ash2@gmail.com",
    }),
    User.create({
      id: 2,
      firstName: "Mr",
      lastName: "Robot",
      username: "testuser2",
      email: "ash@gmail.com",
    }),
    Account.create({
      userId: 1,
      balance: 1000.3,
      upi: "client@op",
    }),
    Account.create({
      userId: 2,
      balance: 1000.3,
      upi: "client2@op",
    }),
  ]);
}

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();
