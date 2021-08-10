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

            it ('lists products',async() =>{
                const products = await marketplace.products(productCount)
                assert.equal(products.name,'Google Pixel 5','name is correct')
                assert.equal(products.price,web3.utils.toWei('1','Ether'),'price is correct')
                assert.equal(products.owner,seller,'owner is correct')
            })

            it ('sells products',async() =>{
                //track the seller balance before 
                let oldSellerBalance = await web3.eth.getBalance(seller)
                oldSellerBalance = new web3.utils.BN(oldSellerBalance)
                //SUCCESS
                result = await marketplace.purchaseProduct(productCount , {from:buyer , value:web3.utils.toWei('1','ether')})
                //Check logs
                const product = await marketplace.products(productCount)
                assert.equal(product.name,'Google Pixel 5','name is correct')
                assert.equal(product.price,web3.utils.toWei('1','Ether'),'price is correct')
                assert.equal(product.owner,buyer,'owner is correct')
                assert.equal(product.purchased,true,'owner is correct')
                //Check seller receives funds
                let newSellerBalance = await web3.eth.getBalance(seller)
                newSellerBalance = new web3.utils.BN(newSellerBalance)
                let price = await web3.utils.toWei('1','Ether')
                price = new web3.utils.BN(price)
                const expectedBalance = oldSellerBalance.add(price)
                assert.equal(expectedBalance.toString(),newSellerBalance.toString(),'seller got eth')    
            
                //FAILURE
                await marketplace.purchaseProduct(99 , {from:buyer , value:web3.utils.toWei('1','ether')}).should.be.rejected;
                await marketplace.purchaseProduct(productCount , {from:buyer , value:web3.utils.toWei('0.5','ether')}).should.be.rejected;
                await marketplace.purchaseProduct(productCount , {from:deployer , value:web3.utils.toWei('1','ether')}).should.be.rejected;

            })
        })
    })
})