
const MNEMONIC ="praise wolf enhance skill zone laptop adapt upgrade often obey dilemma degree"
const INFURA_KEY = "582d535a9da54c71bd62900668f6bda2"
const OWNER_ADDRESS = "0x997928ce395d222A1D034d12a975e5a2de714416"
const NFT_CONTRACT_ADDRESS = "0xa576F0673077Fc766BAf9CA551fDA2bF7CAce631"
const NETWORK = 'rinkeby';

const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require('web3');
const NUM_TOKENS = 10;

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.");
    return;
}

const CONTRACT_ABI = require('./build/contracts/SolnSquareVerifier');
const NFT_ABI = CONTRACT_ABI.abi;

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`);
    const web3Instance = new web3(
        provider
    );

    const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" });

    // Tokens issued directly to the owner.
    for (var i = 0; i < NUM_TOKENS; i++) {
        try{

            const result = await nftContract.methods.mint(
            OWNER_ADDRESS,
            i
        ).send({ from: OWNER_ADDRESS });

        console.log("Minted token. Transaction: " + result.transactionHash);
        }catch(e){
            console.log(e)
        }
        
    }
}

main();