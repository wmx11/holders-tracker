const { DataTypes } = require('sequelize');

const { blocks } = require('./databases');

const Blocks = blocks.define('Blocks', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstBlock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  previousBlock: {
    type: DataTypes.INTEGER
  },
  lastBlock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Blocks;
