## Versions
Truffle v5.0.20 (core: 5.0.20)
Solidity v0.5.0 (solc-js)
Node v8.16.0
Web3.js v1.0.0-beta.37

## Install
```
npm install
cd eth-contracts
```

## Testing

Start Ganache CLI in the terminal using

```
ganache-cli -m "ENTER MNEMONIC BIP39"
```

To run truffle tests:

```
truffle compile
truffle migrate
truffle test
```

### Rinkeby Deployment info

To deploy to rinkeby:
```
truffle migrate --network rinkeby
```
* The output:

```
2_deploy_contracts.js
=====================

   Deploying 'Verifier'
   --------------------
   > transaction hash:    0xd2e9ea63ab032a06d8b8ecd4d5939739fb0fdcb9eb60cc5b14a6a5aae3d12ee5
   > Blocks: 2            Seconds: 22
   > contract address:    0xaD922095016B098E807dEFE5f4c5C558501c8022
   > block number:        4541540
   > block timestamp:     1560252832
   > account:             0x997928ce395d222A1D034d12a975e5a2de714416
   > balance:             36.010514005
   > gas used:            1774730
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.0177473 ETH


   Deploying 'SolnSquareVerifier'
   ------------------------------
   > transaction hash:    0xaeca99f6074b6f8dab9a5f92084931c66e5bb56628ee7907902707b7afcc8466
   > Blocks: 1            Seconds: 18
   > contract address:    0xa576F0673077Fc766BAf9CA551fDA2bF7CAce631
   > block number:        4541542
   > block timestamp:     1560252862
   > account:             0x997928ce395d222A1D034d12a975e5a2de714416
   > balance:             35.965980275
   > gas used:            4453373
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.04453373 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.06228103 ETH


Summary
=======
> Total deployments:   3
> Final cost:          0.06501265 ETH

```

## Minting Tokens

```
node mint.js
```
* output:
```
Minted token. Transaction: 0xbf4ee79bd58c139610d41f0b655dd69b3ec3e017196d772ee01879431c691f8b
Minted token. Transaction: 0x95d8c284ed2ca0ab11ed1b8ab758fe21d39a54559702e9fe3dd7f471cbcabf0f
Minted token. Transaction: 0x4237ae4f434f05f80709a779053ad136a4aa9d802889b108abde21b51b20d896
Minted token. Transaction: 0xab92b1099dd74503fcca993f8f1b8b81f7c745d5d26974dab1a36f0545eefad6
Minted token. Transaction: 0x4b8d86916302c8fbd7d85cf03600c45e23d0cee86db0c016d40277eeb96b31eb
Minted token. Transaction: 0x8b66a460fa6fffd440625e2191edf7145b9cfb90300ef8c0d223fcf8728ebbab
Minted token. Transaction: 0xf3243d2e1a578316706fe01c9d11291263f4da3f2e733e49da184caa48c1e37a
Minted token. Transaction: 0x32070be94f26d55babdc383de4d76e15818fd2ac203449de72cca20bdd3353ea
Minted token. Transaction: 0xd3302dc77974c4d74b033a26742e9872a87c04cfa3c23b915c68bd35b4b6749f
Minted token. Transaction: 0x16a934068907f5629cc22144fda0cdb82fd2a3d7e71fb257fe9889ef609c41c2
```
## Open Sea account

* Users

```
https://rinkeby.opensea.io/accounts/0x997928ce395d222a1d034d12a975e5a2de714416
https://rinkeby.opensea.io/accounts/0x94dc392D699ef2F92c54909904b509F64B7354c0
```
* Token

```
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/0
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/1
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/2
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/3
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/4
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/5
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/6?
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/7?
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/8?
https://rinkeby.opensea.io/assets/0xa576f0673077fc766baf9ca551fda2bf7cace631/9?

```

* sold Token
```
Token 1 & 2
Buyer address: 0x94dc392D699ef2F92c54909904b509F64B7354c0
```

### Zokrates Steps

```
docker run -v /home/Howlla/BlockchainCapstone/zokrates/code:/home/zokrates/code -ti zokrates/zokrates /bin/bash
cd code/square
~/zokrates compile -i square.code
~/zokrates setup --proving-scheme pghr13
~/zokrates compute-witness -a 3 9
~/zokrates generate-proof --proving-scheme pghr13
~/zokrates export-verifier --proving-scheme pghr13
```
update existing Verifier.sol in eth-contracts/contracts with the newly generated - - Verifier.sol under zokrates/code/square
Then, delete the existing build folder and recompile the project


# Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)


