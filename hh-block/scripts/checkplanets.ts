import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const planetNFTAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const planetNFTContract = await ethers.getContractAt(
    "PlanetNFT",
    planetNFTAddress
  );

  const balance = await planetNFTContract.balanceOf(owner.address);
  console.log(
    `Balance of Planet NFT in account ${owner.address}: ${balance.toString()}`
  );
}

main().catch((error) => {
  console.error(error);
});
