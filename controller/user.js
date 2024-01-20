const db = require("../config/db");
const User = db.User;
const Account = db.Account;

/**
 * Registers a new user account.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - The result of the user registration process.
 */
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

/**
 * Fetches all user accounts.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<Object>} - The result of fetching all user accounts.
 */
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

/**
 * Fetches a user by their username.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - The result of fetching a user by username.
 */
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
