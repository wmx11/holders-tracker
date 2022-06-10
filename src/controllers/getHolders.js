const constructDynamicQuery = require('../services/ConstructDynamicQuery');

const { PrismaClient } = require('@prisma/client');
const excludedWallets = require('../../utils/excludedWallets');
const prisma = new PrismaClient();

const getHolders = async (payload) => {
  const perPage = parseInt(payload.limit, 10) || 100;

  const excludeWallets = {
    NOT: excludedWallets.map((wallet) => ({
      address: {
        contains: wallet,
      },
    })),
  };

  try {
    const { query } = constructDynamicQuery(payload, 'holders');

    const countQuery = { ...query };

    delete countQuery.take;
    delete countQuery.skip;

    // countQuery.where = { ...countQuery.where, ...excludeWallets };

    const count = await prisma.holders.count({ ...countQuery });
    const pageCount = Math.ceil(count / perPage);
    const page = parseInt(payload.page, 10) || 1;

    if (payload.limit || payload.page) {
      query.take = parseInt(payload.limit, 10) || perPage;
      query.skip = page * perPage - perPage;
    }

    // query.where = { ...query.where, ...excludeWallets };

    const holders = await prisma.holders.findMany({ ...query });

    const pagination = {
      count,
      perPage,
      pageCount,
      page,
      hasNextPage: page < pageCount,
    };

    return { holders, ...pagination };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = getHolders;
