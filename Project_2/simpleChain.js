
const SHA256 = require('crypto-js/sha256');

const {
  addLevelDBData,
  getLevelDBData,
  getAllLevelDBData,
  addDataToLevelDB
} = require('./levelSandbox')

const { Block } = require('./block')


//Configure simpleChain.js with levelDB to persist blockchain dataset using the level Node.js library.
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


class Blockchain{
  constructor(){
    getAllLevelDBData()
      .then(data =>{
        //Genesis block persist as the first block in the blockchain using LevelDB
        if(data.length == 0){
          this.addBlock(new Block('Genesis Block - The very first block.'))
        }
      })
    .catch(err =>{
      console.log(`error while reading LevelDb ${err}`)
    })
  }

// addBlock(newBlock) function includes a method to store newBlock with LevelDB.
  addBlock(newBlock){
    return new Promise((resolve,reject) =>{
      getAllLevelDBData()
      .then(data =>{
        newBlock.height = data.length;
        newBlock.time  = new Date().getTime().toString().slice(0, -3)
        if(data.length >0){
          newBlock.previousBlockHash = data[data.length-1].hash;
        }
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        addLevelDBData(data.length, JSON.stringify(newBlock))
        .then(() => {
          resolve(newBlock);
        })
      }).catch(reject)
    })
  }

// Modify getBlockHeight() function to retrieve current block height within the LevelDB chain.
    getBlockHeight(){
      return new Promise((resolve,reject) => {
        getAllLevelDBData()
        .then(data => resolve(data.length - 1))
        .catch(reject)
      })
    }

// Modify getBlock() function to retrieve a block by it's block height within the LevelDB chain.
    getBlock(blockHeight){
      return new Promise((resolve,reject) =>{
        getLevelDBData(blockHeight.toString())
        .then(resolve)
        .catch(reject)
      })
    }

    // Modify the validateBlock() function to validate a block stored within levelDB
     async validateBlock(blockHeight){
      return new Promise((resolve,reject) =>{
       let block = resolve(this.getBlock(blockHeight))
       let blockHash = block.hash;
       block.hash = '';
       let validBlockHash = SHA256(JSON.stringify(block)).toString();
       if(blockHash === validBlockHash){
         return true;
       }
         else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
         } 
      })
    }

   // Modify the validateChain() function to validate blockchain stored within levelDB
    validateChain(){
      let errorLog = [];
      let isBlockValid = false;
      let prevHash = '';
      return new Promise((resolve,reject) => {
        getAllLevelDBData()
        .then(data =>{
          for (var i = 0; i < data.length-1; i++){
            const currentBlock = data[i];
            isBlockValid = this.validateBlock(currentBlock.height);
            if(!isBlockValid){
              errorLog.push(i);
            }
            if (currentBlock.previousBlockHash !== prevHash) {
              errorLog.push(i)
            }
            prevHash = currentBlock.hash;
          }
          if (errorLog.length > 0) {
            console.log('Block errors = ' + errorLog.length)
            console.log('Blocks: ' + errorLog)
          } else {
            console.log('No errors detected')
          }
        })
      })
    }
}

let blockchain = new Blockchain();

(function theLoop (i) {
  setTimeout(() => {
    blockchain.addBlock(new Block(`Test data ${i}`)).then(() => {
      if (--i) {
        theLoop(i)
      }
    })
  }, 100);
})(10);

setTimeout(() => blockchain.validateChain(), 2000)

