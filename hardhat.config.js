require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

require("dotenv");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks:{
    mumbai:{
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["40de229a2f03663d921e2cbbf58988e92a26b29d4168b3dece8e6c0c7de3aef4"]
    },
  },
  etherscan : {
    apiKey: "GB7B9P4NJTCP1MBJ4G87A3J753VU1Q73IT"
  }
  }

  // "https://speedy-nodes-nyc.moralis.io/6098a188076d3937c430f158/polygon/mumbai
  // 0x5FbDB2315678afecb367f032d93F642f64180aa3
  // 1059  npx hardhat clean
  // 1060  npx hardhat compile
  // 1061  npx hardhat run scripts/deploy.js --network mumbai
// c
// npx hardhat run scripts/deploy.js --network mumbai


  // ArnoldDAO  deployed to:  0xC4699F9Fcda710EF4C4a3e8dB0258952cD178A6b
  // 0xF0d33Bf3B9FC6bfB6074d8f357Cbb229D38172e3