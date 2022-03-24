const { Op } = require('sequelize');
const { forEachAsync } = require('foreachasync');

const Base = require('./Base');

const Transfers = require('../../models/Transfers');
const Holders = require('../../models/Holders');

const toDecimals = require('../../utils/toDecimals');
const config = require('../../config');

class HolderWallets extends Base {
  constructor() {
    super();
    this.wallets = [];
  }

  /**
   * Return wallets that have a balance greater than 0
   * @returns Number
   */
  async getHoldersCount() {
    const holdersCount = await Holders.count({
      where: {
        value: {
          [Op.gte]: 7 / 10 ** 18,
        },
      },
    });
    return holdersCount;
  }

  /**
   * Returns an existing wallet address
   * @param {String} address
   * @returns String
   */
  async getExistingWallet(address) {
    const wallet = await Holders.findOne({ where: { address } });
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
        await Holders.update(
          { value: toDecimals(result) || 0 },
          { where: { address } }
        );
      } else {
        await Holders.create({ address, value: toDecimals(result) || 0 });
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
      const transferEvents = await Transfers.findAll({
        attributes: ['address'],
        group: ['address'],
      });

      await forEachAsync(transferEvents, async ({ address }) => {
        const existingWallet = await this.getExistingWallet(address);
        if (!existingWallet) {
          await Holders.create({ address, value: 0 });
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
        const holdersCount = await Holders.count();
        this.setIterations(holdersCount);
      }

      if (this.iteration <= this.iterations) {
        setTimeout(async () => {
          const wallet = await Holders.findOne({
            offset: this.iteration,
            limit: 1,
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
        console.log('New wallets added, balances updated');
        return resolve();
      }
    });
  }
}

module.exports = HolderWallets;
