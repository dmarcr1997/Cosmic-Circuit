// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PlanetModule = buildModule("PlanetModule", (m) => {
  // New code to deploy PlanetNFT and mint 3 NFTs
  const planet = m.contract("PlanetNFT", []);

  const names = ["Earth", "Mars", "Venus"];
  const elements = [
    ["Oxygen", "Nitrogen"],
    ["Carbon Dioxide", "Argon"],
    ["Carbon Dioxide", "Nitrogen"],
  ];
  const lifeTypes = [["Humans", "Animals"], ["None"], ["None"]];

  const mint1 = m.call(planet, "mint", [names[0], elements[0], lifeTypes[0]], {
    id: "mint1",
  });
  const mint2 = m.call(planet, "mint", [names[1], elements[1], lifeTypes[0]], {
    id: "mint2",
    after: [mint1],
  });
  m.call(planet, "mint", [names[2], elements[2], lifeTypes[2]], {
    id: "mint3",
    after: [mint2],
  });

  return { planet };
});

export default PlanetModule;
