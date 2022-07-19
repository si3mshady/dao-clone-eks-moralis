
const hre = require("hardhat");

async function main() {


  const ArnoldDAO = await hre.ethers.getContractFactory("ArnoldDAO");
  const arnoldDao = await ArnoldDAO.deploy();

  await arnoldDao.deployed();

  console.log("ArnoldDAO  deployed to: ", arnoldDao.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// npx hardhat clean
// npx hardhat run scripts/deploy.js --network mumbai