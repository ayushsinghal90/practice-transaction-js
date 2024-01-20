const db = require("../../config/db");
const TRANSACTION_STATUS = require("../../utils/constants/transactionStatus");
const InvalidRequest = require("../../errors/invalidRequest");
const ServerFailure = require("../../errors/serverFailure");
const { checkPromiseResults } = require("../../utils/commons");

const Account = db.Account;
const Transaction = db.Transaction;
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;

/**
 * Completes a transaction, updating the transaction status based on the payment result.
 *
 * @param {Object} sender - The sender user object.
 * @param {Object} receiver - The receiver user object.
 * @param {number} amount - The transaction amount.
 * @returns {Promise<Object>} - The completed transaction object.
 */
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
      // If the error message is too long, provide a generic message.
      transaction.failureMessage =
        err.message.length < 50 ? err.message : "Unknown Error.";
    }
  }

  return await transaction.save();
}

/**
 * Initiates a payment by updating sender and receiver account balances within a transaction.
 * @param {Object} sender - The sender user object.
 * @param {Object} receiver - The receiver user object.
 * @param {number} amount - The transaction amount.
 */
async function makePayment(sender, receiver, amount) {
  await sequelize.transaction(async (transaction) => {
    const senderAccount = await findAccountByUser(sender, transaction);
    const receiverAccount = await findAccountByUser(receiver, transaction);

    validatePaymentDetails(senderAccount, receiverAccount, amount);

    const result = await Promise.allSettled([
      updateAccountBalance(senderAccount, -amount, transaction),
      updateAccountBalance(receiverAccount, amount, transaction),
    ]);

    checkPromiseResults(result);
  });
}

/**
 * Creates a new transaction object.
 * @param {Object} sender - The sender user object.
 * @param {Object} receiver - The receiver user object.
 * @param {number} amount - The transaction amount.
 * @returns {Object} - The new transaction object.
 */
function createNewTransaction(sender, receiver, amount) {
  return Transaction.build({
    senderId: sender.id,
    receiverId: receiver.id,
    amount: amount,
    status: TRANSACTION_STATUS.pending,
  });
}

/**
 * Validates payment details, throwing errors for invalid scenarios.
 *
 * @param {Object} senderAccount - The sender account object.
 * @param {Object} receiverAccount - The receiver account object.
 * @param {number} amount - The transaction amount.
 */
function validatePaymentDetails(senderAccount, receiverAccount, amount) {
  if (!senderAccount) {
    throw new InvalidRequest("Sender does not have an account.");
  } else if (!receiverAccount) {
    throw new InvalidRequest("Receiver does not have an account.");
  } else if (senderAccount.balance - amount < 0) {
    throw new InvalidRequest("Sender balance is insufficient.");
  }
}

/**
 * Finds an account for a given user within a transaction.
 *
 * @param {Object} user - The user object.
 * @param {Object} transaction - The Sequelize transaction object.
 * @returns {Promise<Object>} - The account object.
 */
async function findAccountByUser(user, transaction) {
  return await Account.findOne(
    {
      where: { userId: user.id },
    },
    { transaction }
  );
}

/**
 * Update the balance of an account.
 * @param {Account} account - The account to be updated.
 * @param {number} amount - The amount to be added (positive) or subtracted (negative).
 * @param {Sequelize.Transaction} transaction - The Sequelize transaction object.
 * @returns {Promise<number>} - A promise resolving to the updated account's ID.
 */
async function updateAccountBalance(account, amount, transaction) {
  const accountId = account.id;
  const minBalanceRequired = amount > 0 ? 0 : Math.abs(amount);

  // Use Sequelize update method to modify the balance in the database
  const [_, affectedRowsCount] = await Account.update(
    { balance: Sequelize.literal(`balance + ${amount}`) },
    {
      where: {
        id: accountId,
        // Ensure the balance is sufficient to perform the transaction during update.
        balance: { [Sequelize.Op.gte]: Math.abs(minBalanceRequired) },
      },
      // Include the transaction object for concurrency control
      returning: true,
      transaction,
    }
  );

  // Check the affectedRowsCount to ensure only one row was updated
  if (affectedRowsCount !== 1) {
    throw new ServerFailure("Please retry after some time.");
  }

  // Log success message if the update is successful
  console.log(
    `Account balance updated successfully. Account ID: ${accountId}.`
  );

  return accountId;
}

module.exports = {
  completeTransaction,
};
