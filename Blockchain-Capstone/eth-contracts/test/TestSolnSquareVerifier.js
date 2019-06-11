const Verifier = artifacts.require('Verifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const proof = {
	"proof":
	{
		"A":["0x2c69bd002688e47bdf8ce96141cb0cceb0377b94033510a6b916cc827caf8e18", "0x2789f94d3531afaf336305973ecbd560efb908fc78473b36d9c8e889e7206029"],
		"A_p":["0x150219b2626f54cd559b87cf72c5adaee0c2b908cffcb78e41771bc7b35785b0", "0x2f5e8fbd1bee42d4badf740de42c0e10ce43d7521a0e09695cdb6d2c40c686be"],
		"B":
			[["0x2a5fa0b573dab059eacfc4f49a9e254b5631abbdc90148b6fe62270914b254f5", "0x075618e4d5ed2dec07d3385d2d44cdec13017b32d18c4daf3255c2e4fa7aff4e"], ["0x1e56fe8d7b2f7ef9edb4fdbae7fead98bb0ec15b94350cd161ecc9c47159d3f1", "0x1a58472fa1257c2ea2753e79b2ddecc8474a4840e63dfe843c78a24c0e1ce5f1"]],
		
		"B_p":["0x0f88b7321ab38f6ac23d1757e9c048710587bda006567d70bfbfa7da56cc6cea", "0x149654f6d7bb02cee136db21bdb05ab031e0fa661393b58aa1ecc1ae0187809d"],
		"C":["0x210a1f130b4473a5ca8cffaf590af874a7bca7f68da62a06f6fd8eed4f0e62ea", "0x2f548f987028ec42d707ce3e580c9052a84ae44c0d2fd985c7bb0e0ae3aebee6"],
		"C_p":["0x2e2f95250cdc5c6bcd75f0fe5d8e60d6c1abdd2fb460351ad7a74d68c37d60f6", "0x1766463a9ea28a3e9cf8364dc508f772944fb33272ddfe5725d784944c852430"],
		"H":["0x24c68d24abff9be5462192d223d905efdc8512f0c81112992ca2fc0afc4bdd20", "0x298645f1d2a094bb7d23d46d6dfc711239d5ed2130fa5283a9dd3ccd6daaad90"],
		"K":["0x236a1420b5d93ffb76698d995ed4fa9c5f69d08be69c17867e67f76b3f499488", "0x111dd70f94234fc89ea7c29e275dc6ec21583056a7979819ee183158b36fd962"]
	},
	"input":[9,1]
}
contract('solnSquareVerifier',(accounts)=>{
    const account_one = accounts[0];
    const account_two = accounts[1];
    const A = proof["proof"]["A"];
    const A_p = proof["proof"]["A_p"];
    const B = proof["proof"]["B"];
    const B_p = proof["proof"]["B_p"];
    const C = proof["proof"]["C"];
    const C_p = proof["proof"]["C_p"];
    const H = proof["proof"]["H"];
    const K = proof["proof"]["K"];
    const correctProofInput = proof["input"];
describe('test square solution contract',function(){
    beforeEach(async function(){
        this.verifierContract = await Verifier.new();
        this.contract = await SolnSquareVerifier.new(this.verifierContract.address,{from:account_one});
    });
    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('is able to add new solutions',async function (){
        
        let result = await this.contract.addSolution(account_two, 2, A, A_p, B, B_p, C, C_p, H, K, correctProofInput);
        let event  = result.logs[0].event;
        assert.equal("solutionAdded", event, "Unable to add new solution");
    })
    it('fails when same solution tried to be added',async function(){
        let failed = false;
        try{
            await this.contract.addSolution(account_two, 2, A, A_p, B, B_p, C, C_p, H, K, correctProofInput);

            await this.contract.addSolution(account_two, 2, A, A_p, B, B_p, C, C_p, H, K, correctProofInput);
        }catch(err){
            failed=true
        }
        assert.equal(failed,true,"able to use same solution multiple times");
    })
    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('Test if an ERC721 token can be minted for contract a new solution can be added for contract - SolnSquareVerifier', async function () {
        let canBeMinted = await this.contract.mintNewNFT(account_two, 2, A, A_p, B, B_p, C, C_p, H, K, correctProofInput, {from: account_one});
        let owner = await this.contract.ownerOf(2);
        assert.equal(account_two, owner, "Token was not minted.");
    });
})

})

