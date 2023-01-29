// https://eth-rinkeby.alchemyapi.io/v2/dovacldJcy4CAOU4NU707fd6LPRMUGZD
// dovacldJcy4CAOU4NU707fd6LPRMUGZD

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/ALCHEMY-KEY',
      accounts: [ 'PRIVATE-KEY' ]
    }
  }
}