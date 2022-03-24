const { Sequelize } = require('sequelize');
const path = require('path');
const root = path.resolve('./');
const basePath = `${root}/db`;

const transfers = new Sequelize({
  dialect: 'sqlite',
  storage: `${basePath}/transfers.db`,
});

const holders = new Sequelize({
  dialect: 'sqlite',
  storage: `${basePath}/holders.db`,
});

const blocks = new Sequelize({
  dialect: 'sqlite',
  storage: `${basePath}/blocks.db`,
});

module.exports = { transfers, holders, blocks };
