const db = require("../../config/db");
const TRANSACTION_STATUS = require("../../utils/constants/transactionStatus");
const InvalidRequest = require("../../errors/invalidRequest");
const ServerFailure = require("../../errors/serverFailure");

const User = db.User;
const Account = db.Account;
const Transaction = db.Transaction;
const sequelize = db.sequelize;

async function completeTransaction(sender, receiver, amount) {
  let transaction = createNewTransaction(sender, receiver, amount);
  try {
    await makePayment(sender, receiver, amount);
    transaction.status = TRANSACTION_STATUS.processed;
  } catch (err) {
    transaction.status = TRANSACTION_STATUS.failed;

    if (err instanceof InvalidRequest || err instanceof ServerFailure) {
      transaction.failureMessage = err.message;
    } else {
      transaction.failureMessage =
        err.message.length < 50 ? err.message : "Unknow Error.";
    }
  }

  return await transaction.save();
}

async function makePayment(sender, receiver, amount) {
  await sequelize.transaction(async (transaction) => {
    const senderAccount = await findAccountByUser(sender, transaction);
    const receiverAccount = await findAccountByUser(receiver, transaction);

    validatePaymentDetails(senderAccount, receiverAccount, amount);

    await updateAccountBalance(senderAccount, -amount, transaction);
    await updateAccountBalance(receiverAccount, amount, transaction);
  });
}

function createNewTransaction(sender, receiver, amount) {
  return Transaction.build({
    senderId: sender.id,
    receiverId: receiver.id,
    amount: amount,
    status: TRANSACTION_STATUS.pending,
  });
}

function validatePaymentDetails(senderAccount, recieverAccount, amount) {
  if (!senderAccount) {
    throw new InvalidRequest("Sender does not have a account.");
  } else if (!recieverAccount) {
    throw new InvalidRequest("Reciever does not have a account.");
  } else if (senderAccount.balance - amount < 0) {
    throw new InvalidRequest("Sender balance is insufficient.");
  }
}

async function findAccountByUser(user, transaction) {
  return await Account.findOne(
    {
      where: { userId: user.id },
    },
    { transaction }
  );
}

async function updateAccountBalance(account, amount, transaction) {
  const accountId = account.id;
  const currentBalance = parseFloat(account.balance);
  const newBalance = currentBalance + parseFloat(amount);

  const [_, affectedRowsCount] = await Account.update(
    { balance: newBalance },
    {
      where: { id: accountId, balance: currentBalance },
      returning: true,
      transaction,
    }
  );

  if (affectedRowsCount !== 1) {
    throw new ServerFailure("Please retry after sometime..");
  }

  console.log(
    `Account balance updated successfully. Account ID: ${accountId}, New Balance: ${newBalance}`
  );
}

module.exports = {
  completeTransaction,
};