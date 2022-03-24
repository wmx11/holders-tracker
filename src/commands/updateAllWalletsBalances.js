const HolderWallets = require('../services/HolderWallets');

const holderWallets = new HolderWallets();

(async () => {
  await holderWallets.updateAllWalletsBalances();
})();
