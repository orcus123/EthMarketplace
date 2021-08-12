import React, { Component } from 'react';

class Navbar extends Component {

  constructor(props){
    super(props)
    this.state = {
      account : '',
      productCount: 0,
      products: [],
      loading: true
    }
  }

  render() {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://github.com/orcus123/EthMarketplace"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ethereum Marketplace
          </a>
          <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{this.props.account}</span></small>
          </li>
         </ul>
        </nav>
    );
  }
}

export default Navbar;
