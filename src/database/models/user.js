module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // createdAt: {
      //   type: DataTypes.DATE,
      //   defaultValue: DataTypes.NOW,
      // },
      // updatedAt: {
      //   type: DataTypes.DATE,
      //   defaultValue: DataTypes.NOW,
      // },
    },
    {
      timestamps: true,
      tableName: "Users",
    }
  );

  return User;
};
