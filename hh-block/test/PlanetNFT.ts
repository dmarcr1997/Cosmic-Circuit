import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("PlanetNFT", function () {
  async function deployPlanetFixture() {
    const [owner, addr1] = await hre.ethers.getSigners();

    const PlanetNFTFactory = await hre.ethers.getContractFactory("PlanetNFT");
    const planet = await PlanetNFTFactory.deploy();

    return { planet, owner, addr1 };
  }

  it("should mint a new planet NFT and assign correct owner", async () => {
    const { planet, owner } = await loadFixture(deployPlanetFixture);
    const name = "Earth";
    const elements = ["Oxygen", "Nitrogen"];
    const lifeTypes = ["Humans", "Animals"];

    const mintTx = await planet.mint(name, elements, lifeTypes);
    const tokenId = 0;

    expect(await planet.ownerOf(tokenId)).to.equal(owner.address);

    const planetDetails = await planet.getPlanet(tokenId);

    expect(planetDetails[0]).to.equal(name); // Name
    expect(planetDetails[2]).to.deep.equal(elements); // Elements
    expect(planetDetails[3]).to.deep.equal(lifeTypes); // LifeTypes
    expect(planetDetails[1]).to.not.equal(0); // Random Seed
  });
  it("should increment token IDs correctly", async function () {
    const { planet, owner } = await loadFixture(deployPlanetFixture);
    const names = ["Earth", "NX-0092"];
    const elements = [
      ["Oxygen", "Nitrogen"],
      ["Carbon", "Nitrogen", "Hydrogen"],
    ];
    const lifeTypes = [
      ["Humans", "Animals"],
      ["Humans", "Animals", "Insects"],
    ];
    for (let i = 0; i < names.length; i++)
      await planet.mint(names[i], elements[i], lifeTypes[i]);
    expect(await planet.ownerOf(0)).to.equal(owner.address);
    expect(await planet.ownerOf(1)).to.equal(owner.address);
    expect(await planet.balanceOf(owner.address)).to.equal(2);
  });
});
