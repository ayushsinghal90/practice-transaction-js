const db = require("../config/db");
const { completeTransaction } = require("./handlers/payment");

const User = db.User;
const Transaction = db.Transaction;

async function startPayment(req, res) {
  try {
    const amount = req.body.amount;
    const sender = await User.findOne({ where: { username: req.body.sender } });
    const receiver = await User.findOne({
      where: { username: req.body.receiver },
    });

    if (!sender || !receiver) {
      return res.status(400).json({ message: "Payment details invalid." });
    }

    const transaction = await completeTransaction(sender, receiver, amount);
    return res.json(transaction);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server error. Please retry after sometime." });
  }
}

async function findUserPayments(req, res) {
  try {
    const transactions = await Transaction.findAll({
      where: {
        senderId: req.params.userId,
      },
    });

    if (!transactions) {
      return res.status(200).json([]);
    }

    return res.status(200).json(transactions);
  } catch (err) {
    return res.status(500).json({
      message: "Error while fetching transactions.",
      error: err.message,
    });
  }
}

module.exports = {
  startPayment,
  findUserPayments,
};
