const Contract = require('web3-eth-contract');
const contractInterface = require('../contract.json');
const config = require('../config');

Contract.setProvider(config.rpcEndpoint);

module.exports = new Contract(contractInterface, config.contractAddress);
