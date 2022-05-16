const updateWalletsFromPreviousBlock = require('../src/commands/updateWalletsFromPreviousBlock.js');

const CronJob = require('cron').CronJob;

console.log('Starting Jobs');

// Gets new transfer events and new wallets
const getNewWalletsListJob = new CronJob('0 */2 * * * *', () => {
  updateWalletsFromPreviousBlock();
});

getNewWalletsListJob.start();
