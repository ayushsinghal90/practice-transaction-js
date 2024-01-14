module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
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

  if (User === sequelize.models.User) {
    console.log("User table connected");
  }

  return User;
};
