module.exports = function (sequelize, DataTypes) {
  const Account = sequelize.define(
    "account",
    {
      userId: {
        type: DataTypes.INTERGER,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      upi: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "accounts",
      timestamps: true,
    }
  );

  Account.associate = (models) => {
    Account.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Account;
};
