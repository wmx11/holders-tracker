const Web3 = require('web3');

const Blocks = require('../../models/Blocks');

const config = require('../../config');

class Base {
  constructor() {
    this.iteration = 0;
    this.iterations = 0;
    this.contract = require('../Contract');
    this.web3 = new Web3(config.rpcEndpoint);
  }

  async getBlocksCount() {
    return await Blocks.count();
  }

  async getLastBlock() {
    const results = await Blocks.findOne({
      order: [['id', 'DESC']]
    });

    return results;
  }

  addIteration() {
    this.iteration++;
  }

  resetIteration() {
    this.iteration = 0;
  }

  resetIterations() {
    this.iterations = 0;
  }

  getIterations(fromBlock, toBlock) {
    return Math.ceil((toBlock - fromBlock) / config.blockChunks);
  }

  setIterations(iterations) {
    this.iterations = iterations;
  }

  /**
   * @returns Promise
   */
  getLatestBlock() {
    return this.web3.eth.getBlockNumber();
  }

  getWalletBalance(address, cb) {
    return this.contract.methods.balanceOf(address).call({ from: config.walletAddress }, cb);
  }
}

module.exports = Base;
