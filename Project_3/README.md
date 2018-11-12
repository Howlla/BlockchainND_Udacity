# RESTFUL API ON EXPRESS
Interacting with blockchain built in project 2 using API requests 

## Getting Started

```
npm i
node index.js
```

### GET Block Endpoint
The web API contains a GET endpoint that responds to a request using a URL path with a block height parameter or properly handles an error if the height parameter is out of bounds.

The response for the endpoint provides a block object in JSON format.

URL: http://localhost:8000/block/0

### POST Block Endpoint

The web API contains a POST endpoint that allows posting a new block with the data payload option to add data to the block body. Block body should support a string of text.

URL: http://localhost:8000/block
```
{
      "body": "Testing block with test string data"
}
```
The response for the endpoint is a block object in JSON format.
