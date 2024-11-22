const { ethers } = require("hardhat");

async function main() {
  // Define the addresses
  const planetNFTAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const worldContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const tokenId = 0; // Token ID to approve

  // Get the signer (the account that will perform the transaction)
  const [signer] = await ethers.getSigners();

  // Create an instance of the PlanetNFT contract
  const PlanetNFT = await ethers.getContractAt("PlanetNFT", planetNFTAddress);
  const World = await ethers.getContractAt("World", worldContractAddress);

  // Approve the World contract to transfer the token
  const approveTx = await PlanetNFT.approve(worldContractAddress, tokenId);
  await approveTx.wait();

  console.log(
    `Token ID ${tokenId} approved for transfer to World contract at ${worldContractAddress}`
  );
  console.log("Importing planet into World...");
  const importTx = await World.importPlanet(planetNFTAddress, tokenId);
  await importTx.wait();
  console.log("Planet successfully imported into World");
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
