const Transfers = require('../models/Transfers');
const Holders = require('../models/Holders');
const Blocks = require('../models/Blocks');

(async () => {
  await Transfers.sync({ alter: true });
  await Holders.sync({ alter: true });
  await Blocks.sync({ alter: true });

  console.log('All models synchronized successfully');
})();
