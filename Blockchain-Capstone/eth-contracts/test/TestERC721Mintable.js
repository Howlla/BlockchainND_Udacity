var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            let initialMinted=5
            // TODO: mint multiple tokens
            // let resultMint = await this.contract.mint(account_one, 1);
            // let resultMint2 = await this.contract.mint(account_one, 2);
            // let resultMint3 = await this.contract.mint(account_one, 3);
            // let resultMint4 = await this.contract.mint(account_one, 4);
            for (var i=1;i<=initialMinted;i++){
                await this.contract.mint(account_one,i);
            }
        })

        it('should return total supply', async function () { 
            let result = await this.contract.totalSupply();
            assert.equal(result,5,"Total supply of minted tokens does not match initialMinted")
        })

        it('should get token balance', async function () { 
            let result = await this.contract.balanceOf.call(account_one);
            assert.equal(result,5,"Incorrect balanceOf account")
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let result = await this.contract.tokenURI.call(1);
            assert.equal(result,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1","URI does not match to specification");
        })

        it('should transfer token from one owner to another', async function () { 
            //from,to,tokenId
            await this.contract.transferFrom(account_one,account_two,3);
            let result1 = await this.contract.balanceOf.call(account_two);
            let result2 = await this.contract.ownerOf.call(3);
            assert.equal(result1,1,"balance of new owner does not match");
            assert.equal(result2,account_two,"Token ownership not transferred")
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try{
                await this.contract.mint(account_one,6,{from:account_two})
            }
            catch(err){
                failed = true;
            }
            assert.equal(failed, true, "able to mint from any account")
        })

        it('should return contract owner', async function () { 
            let result = await this.contract.getOwner();
            assert.equal(result,account_one,"contract owner do not match")
        })

    });
})