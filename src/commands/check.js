const TransferEvents = require('../services/TransferEvents');

const transferEvents = new TransferEvents();

(async () => {
  await transferEvents.check();
})();
