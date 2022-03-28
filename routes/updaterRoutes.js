module.exports = (app) => {
  app.get('/partial-wallets-update', async (req, res) => {
    try {
      res.send('Updating wallets');
      require('../src/commands/partialWalletsUpdate');
    } catch (err) {
      console.log(err);
    }
  });
};
