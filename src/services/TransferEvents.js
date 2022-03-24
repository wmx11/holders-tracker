const { Op } = require('sequelize');

const Base = require('./Base');

const Transfers = require('../../models/Transfers');
const Blocks = require('../../models/Blocks');

const config = require('../../config');

class TransferEvents extends Base {
  constructor() {
    super();
  }

  /**
   * Returns a list of Transfer events from/to givent blocks on the chain
   * @param {Number} fromBlock
   * @param {Number} toBlock
   * @returns Promise
   */
  getPastTransferEvents(fromBlock, toBlock) {
    return this.contract.getPastEvents('Transfer', {
      fromBlock,
      toBlock,
    });
  }

  /**
   * Creates new Transfers database entries from the
   * Given results array
   * @param {Array} results
   */
  addTransferEvents(results) {
    results.forEach(async (result) => {
      const {
        returnValues: { to },
        blockNumber,
      } = result;
      if (to !== config.contractAddress) {
        await Transfers.create({ address: to, block: blockNumber });
      }
    });
  }

  /**
   * Queries past transfer events
   * And creates new Transfers database entries
   * Updates Blocks database entries
   * @param {Number} fromBlock
   * @param {Number} toBlock
   */
  buildPastTransferEventsData(fromBlock, toBlock) {
    return new Promise(async (resolve, reject) => {
      if (this.iterations === 0) {
        const lastBlock = await this.getLastBlock();

        if (!lastBlock) {
          const latestBlock = await this.getLatestBlock();

          await Blocks.create({
            firstBlock: config.contractCreationStartBlock,
            previousBlock: config.contractCreationStartBlock,
            lastBlock: latestBlock,
          });
        }

        this.setIterations(this.getIterations(fromBlock, toBlock));

        console.log(`Iterations: ${this.iterations}`);
      }

      const pastTransferEvents = await this.getPastTransferEvents(
        fromBlock,
        fromBlock + config.blockChunks
      );

      if (this.iteration <= this.iterations) {
        this.addIteration();

        console.log(`Iteration: ${this.iteration}`);

        this.addTransferEvents(pastTransferEvents);

        const newFromBlock = fromBlock + config.blockChunks;
        const newToBlock = newFromBlock + config.blockChunks;

        const lastTransferEvent = await Transfers.findOne({
          order: [['id', 'DESC']],
          limit: 1,
        });

        const lastBlock = await this.getLastBlock();

        if (lastBlock && lastTransferEvent) {
          await Blocks.update(
            { lastBlock: lastTransferEvent.block },
            {
              where: {
                id: 1,
              },
            }
          );
        }

        return resolve(
          this.buildPastTransferEventsData(newFromBlock, newToBlock)
        );
      } else {
        this.resetIteration();
        this.resetIterations();

        return resolve();
      }
    });
  }

  /**
   * Return all Transfer events from the previous block
   * Previous block is set when the init() method is called
   * @returns [Array]
   */
  getPreviousTransferEvents() {
    return new Promise(async (resolve, reject) => {
      const { previousBlock } = await this.getLastBlock();
      const previousTransferEvents = await Transfers.findAll({
        where: {
          block: {
            [Op.gte]: previousBlock,
          },
        },
      });

      return resolve(previousTransferEvents);
    });
  }

  /**
   * Performs a check on the blockchain
   * To get all new past Transfer events
   * Creates new entries
   * Updates Blocks database
   */
  check() {
    return new Promise(async (resolve, reject) => {
      const lastBlock = await this.getLastBlock();

      const fromBlock = lastBlock
        ? lastBlock.lastBlock
        : config.contractCreationStartBlock;

      const toBlock = await this.getLatestBlock();

      if (lastBlock) {
        await Blocks.update(
          { previousBlock: fromBlock },
          {
            where: {
              id: 1,
            },
          }
        );
      }

      console.log('Checking ->', fromBlock, toBlock);

      return resolve(this.buildPastTransferEventsData(fromBlock, toBlock));
    });
  }
}

module.exports = TransferEvents;
