const TRANSACTION_STATUS = require("../utils/constants/transactionStatus");

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recieverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        values: [
          TRANSACTION_STATUS.processed.ordinal,
          TRANSACTION_STATUS.pending.ordinal,
          TRANSACTION_STATUS.failed.ordinal,
          TRANSACTION_STATUS.success.ordinal,
        ],
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
