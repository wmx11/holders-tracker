const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HolderWallets = require('../services/HolderWallets');

const { format, subMinutes } = require('date-fns');

const holderWallets = new HolderWallets();
let isIterating = false;

module.exports = async () => {
  if (isIterating) {
    return;
  }

  console.log('--- Getting wallets to update ---');
  console.log('--- ... ---');

  const lastUpdatedTime = () => subMinutes(new Date(), 30);

  const walletsToUpdate = await prisma.holders.findMany({
    where: {
      updated_at: {
        lte: lastUpdatedTime(),
      },
    },
  });

  console.log('--- Updating wallets ---');
  console.log('--- ... ---');

  isIterating = true;

  await holderWallets.iterate(walletsToUpdate);

  isIterating = false;

  console.log(format(Date.now(), 'yyy-MM-dd HH:mm:ss'));
  console.log('--- Wallets have been updated ---');
  console.log('--- ... ---');
};
