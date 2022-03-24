const HolderWallets = require('../services/HolderWallets');

const holderWallets = new HolderWallets();

module.exports = async () => {
  const count = await holderWallets.getHoldersCount();
  return count;
};
