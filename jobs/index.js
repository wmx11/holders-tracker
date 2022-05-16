const partialWalletsUpdate = require('../src/commands/partialWalletsUpdate.js');
const updateWalletsFromPreviousBlock = require('../src/commands/updateWalletsFromPreviousBlock.js');

const CronJob = require('cron').CronJob;

console.log('Starting Jobs');

// Gets new transfer events and new wallets
const getNewWalletsListJob = new CronJob('0 */2 * * * *', () => {
  updateWalletsFromPreviousBlock();
});

// Update wallets balance
const partialWalletsUpdateJob = new CronJob('0 */10 * * * *', () => {
  partialWalletsUpdate();
});

getNewWalletsListJob.start();
partialWalletsUpdateJob.start();
