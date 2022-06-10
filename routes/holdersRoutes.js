const HolderWallets = require('../src/services/HolderWallets');
const getHoldersCount = require('../src/commands/getHoldersCount');
const updateWalletsFromPreviousBlock = require('../src/commands/updateWalletsFromPreviousBlock');
const getHolders = require('../src/controllers/getHolders');

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

  app.get('/holders', async (req, res) => {
    try {
      const query = req.query;

      if (!query) {
        return res.setStatus(404).json({ message: 'Query Not Found' });
      }

      const data = await getHolders(query);

      return res.send({ data });
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  });
};
