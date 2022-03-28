const HolderWallets = require('../src/services/HolderWallets');

const getHoldersCount = require('../src/commands/getHoldersCount');
const updateWalletsFromPreviousBlock = require('../src/commands/updateWalletsFromPreviousBlock');

const holderWallets = new HolderWallets();

module.exports = (app) => {
  app.get('/get-holders', async (req, res) => {
    try {
      const holders = await getHoldersCount();
      res.json({ holders });
    } catch (err) {
      console.log(err);
    }
  });

  app.get('/get-average-holdings', async (req, res) => {
    try {
      const average = await holderWallets.getAverageHoldings();
      res.json({ average });
    } catch (err) {
      console.log(err);
    }
  });

  app.get('/update-wallets-list', (req, res) => {
    try {
      res.send('Updating wallets');
      updateWalletsFromPreviousBlock();
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  });

  app.get('/get-position/:address', async (req, res) => {
    try {
      const { address } = req.params;

      if (!address) {
        return res.send({ address: false });
      }

      const position = await holderWallets.getWalletPosition(address);

      return res.send({ address: position });
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  });
};
