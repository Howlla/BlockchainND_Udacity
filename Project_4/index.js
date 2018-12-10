//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

//Bitcoin 
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
//Blockchain
const Blockchain = require("./simpleChain");
const Block = require("./Block");
const blockchain = new Blockchain();
//express setup
const app = express();
const port = 8000;

// Validation window for requests
const validationWindow = 300; // 5 mins

// INSTANTIATING HASHMAPS FOR MEMPOOL
// HashMap from wallet address to validation request timestamp
let blockchainIDValidationTimeoutMap = new Map();
// HashMap from wallet address to validation status
let blockchainIDValidatedMap = new Map();
// HashMap from wallet address to array of block heights assigned with that address
let blockchainIDToBlocksMap = new Map();
// Map from block hash to block height
let blockHashToBlockMap = new Map();

//
function populateMapsFromBlock(block) {
    // We should populate maps only if the block body has an address and star object, else we can ignore it
    if (block.body.address && block.body.star) {
      let blockchainID = block.body.address;
      let blocks = blockchainIDToBlocksMap.get(blockchainID);
      if (blocks === undefined) {
        blocks = [];
      }
      blocks.push(block.height);
      blockchainIDToBlocksMap.set(blockchainID, blocks);
      blockHashToBlockMap.set(block.hash, block.height);
    }
  }
  
  
  // Populate maps by reading all blocks from the blockchain
  function populateMaps() {
    // Populate maps by reading the entire blockchain
    let indices = [];
    let blockHeight = blockchain.getBlockHeight();
    // Skip genesis block as there is no star information on it
    if (blockHeight > 0) {
      let promises = [];
      for (let i = 1; i <= blockHeight; i++) {
        let promise = blockchain.getBlock(i).then(block => populateMapsFromBlock(block));
        promises.push(promise);
      }
      Promise.all(promises).then(() => console.log('Populated internal maps'));
    }  
  }
  // Invoke population of Maps after 100ms of instatiating the blockchain to give enough time to load the same
setTimeout(populateMaps, 100);

// HELPER FUNCTIONS
//Decode star story from hex to ascii
function decodeBlock(block) {
    if (block.body.star) {
      block.body.star.storyDecoded = new Buffer.from(block.body.star.story, 'hex').toString('ascii');
    }
    return block;
  }
//Helper function to check if ascii
  function isValidASCIIString(str){
    if(typeof(str)!=='string'){
        return false;
    }
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>127){
            return false;
        }
    }
    return true;
}
  
//Start express app
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));



//Documentation
app.get('/', (req, res) => {
    let msg = '';
    msg += 'Wellcome to SimpleBlockchain API.<br>';
    msg += 'Folllowing endpoints are available:<br>';
    msg += '| method | endpoint                    | description <br>';
    msg += '-----------------------------------------------------------------------------------------<br>';
    msg += '| GET    | /height                     | Blockchain height<br>';
    msg += '| POST   | /requestValidation          | Request validation<br>';
    msg += '| POST   | /message-signature/validate | POst credentials to be vlidated<br>';
    msg += '| POST   | /block                      | Add a new block to the chain<br>';
    msg += '| GET    | /stars/hash:[HASH]          | Lookup a star by hash<br>';
    msg += '| GET    | /stars/address:[ADDRESS]    | Lookup stars registered by given address<br>';
    msg += '| GET    | /block/[HEIGHT]             | Lookup a star registered at given block number<br>';
    res.send('<pre>' + msg + '</pre>');
  });
//GET height of blockchain
app.get('/height', async (req, res) => {
    blockchain
      .getBlockHeight()
      .then(h=>res.send({'height': h}))
      .catch((err) => res.sendStatus(404));
  });
  // GET block from Index
app.get('/block/:index', async (request, response) => {
    try{
        let chainHeight = await blockchain.getBlockHeight();
        let nHeight = parseInt(request.params.index);
        if( nHeight<0 || nHeight>chainHeight || nHeight===undefined ){
            throw new Error("Block out of bounds");
        }
        else{
            let block = await blockchain.getBlock(nHeight);
            response.send(decodeBlock(block));
        }
        
    }
    catch (error) {
        response.status(404).json ({
          "status": 404,
          "message": `${error.message}`
      });
  }
})

// POST endpoint validates request with JSON response.
  app.post('/requestValidation', (req, res, next) => {
    // Valide that we have a valid request
    if (!req.body ||
        !req.body.address || !(typeof req.body.address === 'string')) {
      return res.sendStatus(400);
    }
  
    let blockchainID = req.body.address;
    // Get validation request timestamp if earlier made
    let requestTimestamp = blockchainIDValidationTimeoutMap.get(blockchainID);
    let currTimestamp = Math.floor((new Date().getTime()) / 1000);
    let timeRemaining = validationWindow;
    if (requestTimestamp == undefined) {
      // This is the first time we are getting a request for this blocchainID
      blockchainIDValidationTimeoutMap.set(blockchainID, currTimestamp);
      requestTimestamp = currTimestamp;
    } else {
      // We have an earlier got a request. We should calculate time remaining
      let timeElapsed = currTimestamp - requestTimestamp;
      // If we have crossed the validationWindow we should reset timestamps
      if (timeElapsed >= validationWindow) {
        blockchainIDValidationTimeoutMap.set(blockchainID, currTimestamp);
        requestTimestamp = currTimestamp;
        timeRemaining = validationWindow;
      } else {
        timeRemaining = validationWindow - timeElapsed;
      }
    }
    let response = {
      'address': blockchainID,
      'requestTimeStamp': requestTimestamp.toString(),
      'message': blockchainID + ':' + requestTimestamp.toString() + ':' + 'starRegistry',
      'validationWindow': timeRemaining.toString()
    };
    res.send(response);
  });
  
  //POST endpoint validates message signature with JSON response.
  app.post('/message-signature/validate', (req, res, next) => {
    // Valide that we have a valid request
    if (!req.body ||
        !req.body.address || !(typeof req.body.address === 'string') ||
        !req.body.signature || !(typeof req.body.signature === 'string')) {
      return res.sendStatus(400);
    }
  
    let blockchainID = req.body.address;
    // Get validation request timestamp if earlier made
    let requestTimestamp = blockchainIDValidationTimeoutMap.get(blockchainID);
  
    if (requestTimestamp == undefined) {
      // The user failed to validate earlier
      res.status(500);
      res.send({'registerStar': false, 'error': 'Blockchain ID validation not requested'});
    } else {
      let currTimestamp = Math.floor((new Date().getTime()) / 1000);
      let timeElapsed = currTimestamp - requestTimestamp;
      let timeRemaining = validationWindow - timeElapsed;
      let message = blockchainID + ':' + requestTimestamp.toString() + ':' + 'starRegistry';
      let registerStar = true;
      let messageSignature = 'valid';
      // Check if we have crossed the validationWindow
      if (timeRemaining <= 0) {
        registerStar = false;
        timeRemaining = 0;
        res.status(500);
      }
      // Check if message signature is valid
      if (!bitcoinMessage.verify(message, blockchainID, req.body.signature)) {
        registerStar = false;
        messageSignature = 'invalid';
        res.status(500);
      }
  
      let response = {
        'registerStar': registerStar,
        'status': {
          'address': blockchainID,
          'requestTimestamp': requestTimestamp.toString(),
          'message': message,
          'validationWindow': timeRemaining.toString(),
          'messageSignature': messageSignature
        }
      };
      res.send(response);
      blockchainIDValidatedMap.set(blockchainID, registerStar);
    }
  });
  

//POST a block
app.post('/block', async (req, res,next) => {
    const { address, star } = req.body;
    if (!address) return res.status(400).send({message: '"address" is required.'});
    if (!star) return res.status(400).send({message: '"star" is required.'});
    if (!star.dec) return res.status(400).send({message: '"star.dec" is required.'});
    if (!star.ra) return res.status(400).send({message: '"star.ra" is required.'});
    if (!star.story) return res.status(400).send({message: '"star.story" is required.'});
    if (!isValidASCIIString(star.story)) return res.status(400).send({message:'"star.story is not ascii'})
 
    let blockBody = req.body;
  
    if(blockchainIDValidatedMap.get(blockBody.address) !== true) {
      // The user has not validated the wallet
      res.status(403);
      return res.send({'error': 'Blockchain ID validation is incomplete'});
    }
  
    // Hex code the story
    blockBody.star.story = new Buffer.from(blockBody.star.story).toString('hex');
  
    blockchain.addBlock(new Block(blockBody)).then(block => {
      populateMapsFromBlock(block);
  
      // Reset validation status by deleting key from validated map and validation timeout map
      // The user will need to re-request validation
      blockchainIDValidatedMap.delete(blockBody.address);
      blockchainIDValidationTimeoutMap.delete(blockBody.address);
  
      res.send(block)
    }).catch(next);
  });

//   GET star block by hash with JSON response.
  app.get('/stars/address/:address', (req, res, next) => {
    let blockchainID = req.params.address;
    if (!(blockchainIDToBlocksMap.has(blockchainID))) {
      res.status(404);
      return res.send({'error': 'No stars registered with address ' + blockchainID});
    }
    Promise.all(blockchainIDToBlocksMap.get(blockchainID).map(blockchain.getBlock)).then(blocks => {
      let decodedBlocks = blocks.map(decodeBlock);
      res.send(decodedBlocks);
    }).catch(next);
  });
// GET star 
  app.get('/stars/hash/:hash', (req, res, next) => {
    let blockHash = req.params.hash;
    if (!(blockHashToBlockMap.has(blockHash))) {
      res.status(404);
      return res.send({'error': 'No stars registered with block hash ' + blockHash});
    }
    blockchain.getBlock(blockHashToBlockMap.get(blockHash)).then(block => res.send(decodeBlock(block))).catch(next);
  });
  
  


  