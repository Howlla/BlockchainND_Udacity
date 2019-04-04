const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/c555182a0dd242a38339cebce1602301'),
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000
  },
  }
};