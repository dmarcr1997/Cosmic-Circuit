// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WorldModule = buildModule("WorldModule", (m) => {
  const world = m.contract("World", []);

  return { world };
});

export default WorldModule;
