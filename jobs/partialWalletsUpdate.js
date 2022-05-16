const partialWalletsUpdate = require('../src/commands/partialWalletsUpdate.js');

const CronJob = require('cron').CronJob;

console.log('Starting Jobs');

// Update wallets balance
const partialWalletsUpdateJob = new CronJob('0 */10 * * * *', () => {
  partialWalletsUpdate();
});

partialWalletsUpdateJob.start();
