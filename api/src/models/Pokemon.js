const { DataTypes} = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id : {
      type : DataTypes.INTEGER,
      autoIncrement: true,
      allowNull : false,
      primaryKey : true,
    },
    identificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life :{
      type : DataTypes.INTEGER
    },
    attack:{
      type : DataTypes.INTEGER
    },
    defense: {
      type : DataTypes.INTEGER
    },
    speed : {
      type: DataTypes.INTEGER
    },
    specialAttack : {
      type: DataTypes.INTEGER
    },
    specialDefense : {
      type: DataTypes.INTEGER
    },
    height : {
      type : DataTypes.INTEGER
    },
    weight : {
      type : DataTypes.INTEGER
    },
    image :{
      type : DataTypes.STRING
    }
    },{
      timestamps: false 
    }
  );
};
