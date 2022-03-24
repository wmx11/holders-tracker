const HolderWallets = require('./services/HolderWallets');
const TransferEvents = require('./services/TransferEvents');

const transferEvents = new TransferEvents();
const holderWallets = new HolderWallets();

(async () => {
  console.log('--- Initializing holders database ---');
  console.log('--- This will build the Transfer Events database, Unique Wallets database, and will update all wallet balances ---');
  console.log('--- ... ---');
  console.log('--- This will take a while ---');

  console.log('--- Building Transfer Events database ---');

  await transferEvents.check();
  
  console.log('--- Transfer Events database has been built ---');

  console.log('--- ... ---');

  console.log('--- Building Unique Wallets database ---');

  await holderWallets.buildUniqueWalletsDatabase();

  console.log('--- Unique Wallets database has been built ---');

  console.log('--- ... ---');

  console.log('--- Updating wallets balances ---');

  await holderWallets.updateAllWalletsBalances();

  console.log('--- Wallets balances have been updated ---');
})();