const { assert } = require("chai");

require('chai')
    .use(require('chai-as-promised'))
    .should()


const Marketplace = artifacts.require('./Marketplace.sol')

contract('Marketplace',([deployer,seller,buyer])=> {
    let marketplace 

    before(async () =>{
        marketplace = await Marketplace.deployed();
    })

    describe('deployment', async()=>{
        it ('deploys successfully',async() =>{
            const address = await marketplace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })

        it('has a name', async() =>{
            const name = await marketplace.name()
            assert.equal(name,'Ethereum Marketplace')
        })

        describe('products', async()=>{
            let result, productCount

            before(async() => {
                result = await marketplace.createProduct('Google Pixel 5', web3.utils.toWei('1','Ether'),{from:seller})
                productCount = await marketplace.productCount()
            })

            it ('creates products',async() =>{
                //SUCCESS
                assert.equal(productCount,1,'id is correct')
                const event = result.logs[0].args 
                assert.equal(event[1],'Google Pixel 5','name is correct')
                assert.equal(event[2],web3.utils.toWei('1','Ether'),'price is correct')
                assert.equal(event[3],seller,'owner is correct')
                //FAILURE: name
                await marketplace.createProduct('Google Pixel 5', web3.utils.toWei('0','Ether'),{from:seller}).should.be.rejected;



            })
        })
    })
})