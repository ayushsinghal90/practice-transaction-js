const db = require("../config/db");
const User = db.User;
const Account = db.Account;
const sequelize = db.sequelize;

async function makePayment(req, res) {
  const amount = req.body.amount;
  const receiver = req.body.receiver;
  const sender = req.body.sender;

  try {
    await sequelize.transaction(async (transaction) => {
      const senderAccount = await findAccountByUsername(sender, transaction);
      const receiverAccount = await findAccountByUsername(
        receiver,
        transaction
      );

      const details = validatePaymentDetails(
        senderAccount,
        receiverAccount,
        amount
      );

      if (!details.valid) {
        return res.status(400).json({ message: details.message });
      }

      await updateAccountBalance(senderAccount, -amount, transaction);
      await updateAccountBalance(receiverAccount, amount, transaction);
    });

    return res.status(200).json({ message: "Transaction complete." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Transaction failed. Please retry after some time.",
      error: err,
    });
  }
}

function validatePaymentDetails(senderAccount, recieverAccount, amount) {
  if (!senderAccount) {
    return { valid: false, message: "Sender does not have a account." };
  } else if (!recieverAccount) {
    return { valid: false, message: "Reciever does not have a account." };
  } else if (senderAccount.balance - amount < 0) {
    return { valid: false, message: "Sender balance is insufficient." };
  }
  return { valid: true, message: null };
}

async function findAccountByUsername(username, transaction) {
  return await Account.findOne(
    {
      include: [{ model: User, where: { username: username }, attributes: [] }],
    },
    { transaction }
  );
}

async function updateAccountBalance(account, amount, transaction) {
  const newBalance = parseFloat(account.balance) + parseFloat(amount);
  await Account.update(
    { balance: newBalance },
    { where: { id: account.id, balance: account.balance } },
    { transaction }
  );
}

module.exports = {
  makePayment,
};
