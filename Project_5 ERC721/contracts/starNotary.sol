pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }
//  Add a name and a symbol for your starNotary tokens
//
    function symbol() public pure returns (string _symbol) {
        return "YEET";
    }

    function name() public pure returns (string _name) {
        return "MemeND coin";
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

// Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
//


    function lookUptokenIdToStarInfo(uint256 _tokenId)view  public returns (string _starName) {
        require(_exists(_tokenId));
        return tokenIdToStarInfo[_tokenId].name;
    }


    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
      }

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.

    function exchangeStars(uint256 _incomingToken, uint256 _outgoingToken) public {
        //Check existence of tokens being traded
        require(_exists(_incomingToken) && _exists(_outgoingToken));
        //storing addresses of owners of token in variables
        address incomingTokenOwner = ownerOf(_incomingToken);
        address outgoingTokenOwner = ownerOf(_outgoingToken);
        //Can't Exchange with self
        require(incomingTokenOwner != outgoingTokenOwner);
        //Check ownership of token being sent
        require(outgoingTokenOwner == msg.sender);
        //Check if sender is approved to manage incoming token
        require(msg.sender == getApproved(_incomingToken));
        //Transfering over tokens 

        transferFrom(incomingTokenOwner, outgoingTokenOwner, _incomingToken);
        transferFrom(outgoingTokenOwner, incomingTokenOwner, _outgoingToken);

    }

// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
//
    function transferStar(address _to, uint256 _tokenId) public{
        require(_exists(_tokenId));
        //Token must be owned by sender
        require(_isApprovedOrOwner(msg.sender, _tokenId));
        //Transfering
        transferFrom(msg.sender, _to, _tokenId);
    }
}
