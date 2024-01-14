const TRANSACTION_STATUS = require("../utils/constants/transactionStatus");

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        values: [
          TRANSACTION_STATUS.processed,
          TRANSACTION_STATUS.pending,
          TRANSACTION_STATUS.failed,
        ],
      },
      failureMessage: {
        type: DataTypes.STRING(50),
      },
    },
    {
      tableName: "transactions",
      timestamps: true,
      indexes: [
        {
          name: "sender_idx",
          fields: ["senderId"],
        },
        {
          name: "reciever_idx",
          fields: ["recieverId"],
        },
      ],
    }
  );

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "senderId" });
    Transaction.belongsTo(models.User, { foreignKey: "recieverId" });
  };

  if (Transaction === sequelize.models.Transaction) {
    console.log("Transaction table connected");
  }

  return Transaction;
};
