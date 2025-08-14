const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TubeDAO Registry contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const Registry = await ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  
  await registry.waitForDeployment();
  
  console.log("Registry deployed to:", await registry.getAddress());
  console.log("Contract deployed successfully");
  
  console.log("Deployment confirmed");
  
  console.log("Deployment completed!");
  console.log("Contract addresses:");
  console.log("Registry:", registry.address);
  
  console.log("Verifying deployment...");
  
  const isMember = await registry.isMember(deployer.address);
  console.log("Deployer is member:", isMember);
  
  const totalMembers = await registry.getTotalMembers();
  console.log("Total members:", totalMembers.toString());
  
  const registrationFee = await registry.registrationFee();
  console.log("Registration fee:", registrationFee.toString(), "VANA (FREE)");
  
  console.log("\nNext steps:");
  console.log("1. Update backend .env file with:");
  console.log(`   REGISTRY_CONTRACT_ADDRESS=${await registry.getAddress()}`);
  console.log("2. Verify the contract on VanaScan");
  console.log("3. Test the contract functions");
  
  return {
    registry: await registry.getAddress(),
    deployer: deployer.address,
  };
}

main()
  .then(() => {
    console.log("Deployment script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
