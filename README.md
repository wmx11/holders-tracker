# Holders Count Service

## This is a simple holders count service that will build a local database of uniquie wallets that have interacted with the given contract and will keep the wallet list balances updated.  

<br/>

## `If you want to automate this, you will need some hosting platform and a cron-job to run this service`

<br/>

---
## How to use this service
## Before you run any commands, please do the following:
- Set up the `config.js` file
  - `walletAddress` - Your wallet address or any other wallet address that will be used for calling smart contract methods.
  - `contractAddress` - Smart contract wallet address
  - `contractCreationStartBlock` - Block number when the smart contract was created. You can use other block numbers that are beyond the creation date.
  - `rpcEndpoint` - RPC endpoint that is used to communicate with Web3 and smart contracts. Default is the BSC RPC endpoint.
  - `blockChunks` - Number of chunks to use in each block number. `2000` chunks will cover 2000 blocks. Maximum allowed chunks are `5000`.
  - `requestTimeout` - The frequency at which wallet balances will be accessed and retrieved. Max requests per time: `10000` per 5 minutes, `2000` per 1 minute, `33` per 1 second. The default value will give you `20` requests per second - the safe zone. 

<br>

- Add the contract JSON to the `contract.json` file. You can find the contract JSON on BSC Scan website.

- Run `sh init.sh` command in the terminal
  - This will create the following:
    - Database files
    - Install dependencies
    - Create database tables
    - Run the the `initialize.js` to populate transfers, holders, blocks databases. WARNING - Depending on `contractCreationStartBlock` and the latest block, this can take several hours to complete.

<br>

You can also use the following commands: 
- `npm run db-create` - Will create the databases
- `npm run initialize` - Will run the main initialize.js scripts to build all databases (Will take several hours)
- `npm run check` - Will perform a check on new Transfer events and create new database entries
- `npm run build-unique-wallets` - Will build a database of unique wallet addresses with the value of 0 (Balance)
- `npm run update-wallets-balances` - Will update all of the wallet balances inside the holders database

<br>

The following routes are available:
- `/get-holders` - Will retrieve the amount of holders
  - Response: 
  ```JavaScript
  { holders: 0 }
  ```
- `/update-wallets-list` - Will perform a check for new Transfer events from the previous block, get wallet addresses, and update their balances (If new wallets are found, those will be added to the database)

<br>

Inside a server you can run `node .` to listen to the incoming HTTP requests. Make sure to specify the `PORT` in your `.env` file.