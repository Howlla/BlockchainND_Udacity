// Allows us to use ES6 in our migrations and tests.
require('babel-register')

// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.
var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "c555182a0dd242a38339cebce1602301";
var mnemonic = "praise wolf enhance skill zone laptop adapt upgrade often obey dilemma degree";

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider:  function() {
  return new HDWalletProvider(mnemonic, 
                "https://rinkeby.infura.io/v3/" + infura_apikey,0)},
      network_id: 4
  },
  }
}
