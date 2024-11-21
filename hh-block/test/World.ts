import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("World", function () {
  async function deployWorldFixture() {
    const [owner, addr1] = await hre.ethers.getSigners();

    const WorldFactory = await hre.ethers.getContractFactory("World");
    const world = await WorldFactory.deploy();
    const PlanetFactory = await hre.ethers.getContractFactory("PlanetNFT");
    const planet = await PlanetFactory.deploy();
    await planet
      .connect(owner)
      .mint("Earth", ["Oxygen", "Nitrogen"], ["Humans", "Animals"]);
    const tokenId = 0;

    return { world, planet, owner, addr1, tokenId };
  }

  it("should import a planet NFT into the world", async () => {
    const { world, planet, tokenId } = await loadFixture(deployWorldFixture);

    // Import the planet NFT into the world
    await planet.approve(world.target, tokenId);
    await world.importPlanet(planet.target, tokenId);

    // Check that the owner no longer owns the planet
    expect(await planet.ownerOf(tokenId)).to.equal(world.target);
  });

  it("should not allow someone else to export the planet", async () => {
    const { world, planet, addr1, tokenId } = await loadFixture(
      deployWorldFixture
    );

    // Import the planet NFT into the world
    await planet.approve(world.target, tokenId);
    await world.importPlanet(planet.target, tokenId);

    // Attempt to export the planet from addr1 (should fail)
    await expect(
      world.connect(addr1).exportPlanet(planet.target, tokenId)
    ).to.be.revertedWith("You are not the owner of this planet");
  });

  it("should allow the owner to export the planet and regain ownership", async () => {
    const { world, planet, owner, tokenId } = await loadFixture(
      deployWorldFixture
    );

    // Import the planet NFT into the world
    await planet.approve(world.target, tokenId);
    await world.importPlanet(planet.target, tokenId);

    // Export the planet back to the owner
    await world.exportPlanet(planet.target, tokenId);

    // Check that the owner now owns the planet again
    expect(await planet.ownerOf(tokenId)).to.equal(owner.address);
  });
});
