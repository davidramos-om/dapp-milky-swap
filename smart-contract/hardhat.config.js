// https://eth-rinkeby.alchemyapi.io/v2/dovacldJcy4CAOU4NU707fd6LPRMUGZD
// dovacldJcy4CAOU4NU707fd6LPRMUGZD

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/dovacldJcy4CAOU4NU707fd6LPRMUGZD',
      accounts: [ 'a0593158811d841ff87509ba9f0590ffca248066a9e9032672b3fdc3439364e1' ]
    }
  }
}