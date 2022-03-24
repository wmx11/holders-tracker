const getHoldersCount = require('../src/commands/getHoldersCount');
const updateWalletsFromPreviousBlock = require('../src/commands/updateWalletsFromPreviousBlock');

module.exports = (app) => {
  app.get('/get-holders', async (req, res) => {
    try {
      const holders = await getHoldersCount();
      res.json({ holders });
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
};
