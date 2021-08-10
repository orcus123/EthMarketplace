pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }
    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );
    constructor() public {
        name = "Ethereum Marketplace";
    }

    function createProduct(string memory _name , uint _price) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        //Increment productCount
        productCount++;
        //Create Product
        products[productCount] = Product(productCount,_name,_price,msg.sender,false);
        //Tigger an event
        emit ProductCreated(productCount,_name,_price,msg.sender,false);
    }

    function purchaseProduct(uint _id) public payable{
        //Fetch the product
        Product memory _product = products[_id];
        //Fetch the owner
        address payable _seller = _product.owner;
        //Make sure product is valid
        require(_product.id > 0 && _product.id <= productCount);
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);
        //Purchase
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        //Pay the seller
        address(_seller).transfer(msg.value);
        //Trigger event
        emit ProductPurchased(productCount,_product.name,_product.price,products[_id].owner,true);
    }
}