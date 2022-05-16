const { forEachAsync } = require('foreachasync');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Base = require('./Base');

const excludedWallets = require('../../utils/excludedWallets');
const toDecimals = require('../../utils/toDecimals');
const config = require('../../config');
const axios = require('axios');

class HolderWallets extends Base {
  constructor() {
    super();
    this.wallets = [];
  }

  /**
   * Returns the position of the wallet address
   * In the holders list
   * @param {String} walletAddress
   * @returns Number
   */
  async getWalletPosition(walletAddress) {
    const orderedWallets = await prisma.holders.findMany({
      orderBy: [{ value: 'desc' }],
    });

    const walletPosition = orderedWallets.findIndex(
      (wallet) => wallet.address.toLowerCase() === walletAddress.toLowerCase()
    );

    if (walletPosition > -1) {
      return {
        position: walletPosition + 1,
        wallet: orderedWallets[walletPosition],
      };
    }

    return walletPosition;
  }

  calculateMinHoldingValue(price) {
    const tokensForOneCent = 1 / price / 100;
    return tokensForOneCent;
  }

  /**
   * Return wallets that have a balance greater than 0
   * @returns Number
   */
  async getHoldersCount() {
    const {
      data: { price },
    } = await axios(`${config.serviceEndpoint}/get-price`);

    if (!price) {
      return null;
    }

    const holdersCount = await prisma.holders.count({
      where: {
        value: {
          gte: this.calculateMinHoldingValue(price) / 10 ** 16,
        },
      },
    });

    return holdersCount;
  }

  /**
   * Returns the average holdings
   * @returns {Object}
   */
  async getAverageHoldings() {
    const { _avg } = await prisma.holders.aggregate({
      _avg: {
        value: true,
      },
    });
    // const [results] = await Holders.findAll({
    //   attributes: [[Sequelize.fn('avg', Sequelize.col('value')), 'average']],
    //   where: excludedWallets.map((wallet) => ({
    //     address: { [Op.notLike]: wallet },
    //   })),
    // });
    return _avg.value;
  }

  /**
   * Returns an existing wallet address
   * @param {String} address
   * @returns String
   */
  async getExistingWallet(address) {
    const wallet = await prisma.holders.findFirst({
      where: {
        address,
      },
    });
    return wallet;
  }

  /**
   * Updates existing wallet's balance
   * Creates a new wallet address and updates its balance
   * If the wallet does not exist
   * @param {String} address
   */
  async createOrUpdateWalletBalance(address) {
    const existingWallet = await this.getExistingWallet(address);

    this.getWalletBalance(address, async (err, result) => {
      if (existingWallet) {
        const updatdWallet = await prisma.holders.update({
          where: {
            id: existingWallet.id,
          },
          data: {
            value: toDecimals(result) || 0,
          },
        });

        console.log('Updated ->', updatdWallet.address, updatdWallet.value);
      } else {
        const newEntry = await prisma.holders.create({
          data: {
            address,
            value: toDecimals(result) || 0,
          },
        });
        console.log('Created ->', newEntry.address, newEntry.value);
      }
    });
  }

  /**
   * First time use only!
   * Extracts ALL unique wallets from Transfers database
   * And puts them into the Holders database
   */
  buildUniqueWalletsDatabase() {
    return new Promise(async (resolve, reject) => {
      const transferEvents = await prisma.transfers.findMany({
        distinct: ['address'],
      });

      await forEachAsync(transferEvents, async ({ address }) => {
        const existingWallet = await this.getExistingWallet(address);
        if (!existingWallet) {
          await prisma.holders.create({
            data: {
              address,
              value: 0,
            },
          });
        }
      });

      return resolve();
    });
  }

  /**
   * Iterate the whole Holders database
   * And update each wallet's token balance
   */
  updateAllWalletsBalances() {
    return new Promise(async (resolve, reject) => {
      if (this.iterations === 0) {
        const holdersCount = await prisma.holders.count();
        this.setIterations(holdersCount);
      }

      if (this.iteration <= this.iterations) {
        setTimeout(async () => {
          const wallet = await prisma.holders.findFirst({
            skip: this.iteration,
            take: 1,
          });

          this.addIteration();

          await this.createOrUpdateWalletBalance(wallet.address);

          return resolve(this.updateAllWalletsBalances());
        }, config.requestTimeout);
      } else {
        return resolve();
      }
    });
  }

  /**
   * Iterates through an array of wallet Objects
   * Creates or updates the wallet and its balance
   * @param {Array} wallets
   */
  iterate(wallets) {
    return new Promise(async (resolve, reject) => {
      if (this.iterations === 0) {
        this.wallets = wallets;
        this.setIterations(wallets.length - 1);
      }

      if (this.iteration <= this.iterations) {
        setTimeout(async () => {
          await this.createOrUpdateWalletBalance(
            this.wallets[this.iteration].address
          );
          this.addIteration();
          return resolve(this.iterate(this.wallets));
        }, config.requestTimeout);
      } else {
        this.wallets = [];
        this.resetIteration();
        this.resetIterations();
        console.log('New wallets added, balances updated');
        return resolve();
      }
    });
  }
}

module.exports = HolderWallets;
