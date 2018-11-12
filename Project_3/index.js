//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
//Blockchain
const Blockchain = require("./simpleChain");
const Block = require("./Block");
const blockchain = new Blockchain();
//express setup
const app = express();
const port = 8000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(bodyParser.json());


//Invalid Request
app.get('/', (request, response) => response.status(404).json({
	"status": 404,
	"message": "Accepted endpoints are: POST /block or GET /block/:index " + 
				"For Example: " +
  				"    To get Block use: curl http://localhost:8000/block/0"
}));

// GET REQUEST
app.get('/block/:index', async (request, response) => {
    try{
        let chainHeight = await blockchain.getBlockHeight();
        let nHeight = parseInt(request.params.index);
        if( nHeight<0 || nHeight>chainHeight || nHeight===undefined ){
            throw new Error("Block out of bounds");
        }
        else{
            let block = await blockchain.getBlock(nHeight);
            response.send(block);
        }
        
    }
    catch (error) {
        response.status(404).json ({
          "status": 404,
          "message": `${error.message}`
      });
  }
})

//POST REQUEST
app.post('/block', async (request, response) => {
    try{
        //TESTING
        console.log(request.body);
      
        let nData = request.body.body;
        if(nData === '' || nData === undefined){
            response.status(404).json ({
                "status": 404,
                "message": `body key-value pair ${nData} cannot be empty (Use String)`
            }) 
        }
            await blockchain.addBlock(new Block(nData));

            let height = await blockchain.getBlockHeight();
            let block  = await blockchain.getBlock(height);
            response.send(block);
        
    }
    catch (error){
        response.status(404).json ({
            "status": 404,
            "message": `Could not add block. Please try again. ${error}`
        });
    }
});






