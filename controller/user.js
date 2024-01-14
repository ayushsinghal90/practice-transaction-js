const db = require("../config/db");
const User = db.User;
const Account = db.Account;

async function register(req, res) {
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
    });

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while creating account.", error: err.message });
  }
}

async function fetchAll(req, res) {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while fetching users.", error: err.message });
  }
}

async function fetchUserByUsername(req, res) {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while fetching user.", error: err.message });
  }
}

module.exports = {
  register,
  fetchAll,
  fetchUserByUsername,
};
