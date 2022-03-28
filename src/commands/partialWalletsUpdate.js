const { Op } = require('sequelize');

const Holders = require('../../models/Holders');
const HolderWallets = require('../services/HolderWallets');

const { subHours, format, set } = require('date-fns');

const holderWallets = new HolderWallets();

(async () => {
  console.log('--- Getting wallets to update ---');
  console.log('--- ... ---');

  const walletsToUpdate = await Holders.findAll({
    where: {
      updatedAt: {
        [Op.lte]: set(subHours(new Date(), { hours: 1 }), {
          minutes: 0,
          seconds: 0,
        }),
      },
    },
  });

  console.log('--- Updating wallets ---');
  console.log('--- ... ---');

  await holderWallets.iterate(walletsToUpdate);

  console.log(format(new Date().now(), 'yyy-MM-dd HH:mm:ss'));
  console.log('--- Wallets have been updated ---');
  console.log('--- ... ---');
})();
