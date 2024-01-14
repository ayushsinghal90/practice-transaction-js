module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "user",
    {
      firstName: {
        type: STRING(50),
        allowNull: false,
      },
      lastName: {
        type: STRING(50),
        allowNull: false,
      },
      username: {
        type: STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.assocate = (models) => {
    User.hasOne(models.Account);
  };

  return User;
};
