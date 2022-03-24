const HolderWallets = require('../services/HolderWallets');
const TransferEvents = require('../services/TransferEvents');

const transferEvents = new TransferEvents();
const holderWallets = new HolderWallets();

module.exports = async () => {
  console.log('-- Starting Check --');
  await transferEvents.check();
  console.log('-- ###### --');
  console.log('-- Getting Previous Events --');
  const previousEvents = await transferEvents.getPreviousTransferEvents();
  console.log('-- ###### --');
  console.log('-- Updating Wallets --');
  await holderWallets.iterate(previousEvents);
  console.log('-- ###### --');
  console.log('-- Wallets Updated --');
};
