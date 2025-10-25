const hre = require("hardhat");

async function main() {
  await hre.run('compile');
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  // Replace with the seller test address you want to use
  const seller = process.env.SELLER_ADDRESS || "0x0000000000000000000000000000000000000001";

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  // You can pass value here as the initial deposit; change as needed (in wei)
  const escrow = await Escrow.deploy(seller, { value: hre.ethers.parseEther("0.01") });
  await escrow.waitForDeployment();
  console.log("Escrow deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
