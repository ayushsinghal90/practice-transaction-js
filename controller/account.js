const db = require("../config/db");
const User = db.User;
const Account = db.Account;

/**
 * Registers a new account for the given user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - The result of the registration process.
 */
async function register(req, res) {
  try {
    const user = await findUserByUsername(req.body.username);

    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    const account = await Account.create({
      balance: req.body.balance,
      upi: req.body.upi,
      userId: user.id,
    });

    return res.status(201).json(account);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while creating account.", error: err.message });
  }
}

/**
 * Finds and returns the account information for the specified user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - The result of the account retrieval process.
 */
async function findUserAccount(req, res) {
  try {
    const account = await Account.findOne({
      include: [
        {
          model: User,
          where: { username: req.params.username },
          attributes: [],
        },
      ],
    });

    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not present for this user." });
    }

    return res.status(200).json(account);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while fetching account.", error: err.message });
  }
}

/**
 * Finds a user by their username.
 *
 * @param {string} username - The username to search for.
 * @returns {Promise<Object|null>} - The user object if found, otherwise null.
 */
async function findUserByUsername(username) {
  return await User.findOne({ where: { username: username } });
}

module.exports = {
  register,
  findUserAccount,
};
