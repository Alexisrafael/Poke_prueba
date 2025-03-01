const { DataTypes } = require("sequelize");

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
const bcrypt = require("bcryptjs");
// defino el modelo
module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type : DataTypes.INTEGER,
      autoIncrement: true,
      allowNull : false,
      primaryKey : true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return User;
};