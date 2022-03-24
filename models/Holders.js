const { DataTypes } = require('sequelize');

const { holders } = require('./databases');

const Holders = holders.define('Holders', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Holders;
