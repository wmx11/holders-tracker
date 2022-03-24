## Create database files
mkdir db &&
touch ./db/transfers.db && 
touch ./db/holders.db &&
touch ./db/blocks.db

touch .env

## Install NPM packages
npm install

## Create databases
npm run db-create

## Initialize data building
npm run initialize