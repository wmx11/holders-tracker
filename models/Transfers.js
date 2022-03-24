const { DataTypes } = require('sequelize');

const { transfers } = require('./databases');

const Transfers = transfers.define('Transfers', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  block: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Transfers;
