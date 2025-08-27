const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TubeDAO contracts for Vana Network...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy Registry contract
  console.log("\n1. Deploying Registry contract...");
  const Registry = await ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("Registry deployed to:", registryAddress);

  // 2. Deploy VRC-20 TubeToken
  console.log("\n2. Deploying VRC-20 TubeToken...");
  const TubeToken = await ethers.getContractFactory("TubeToken");
  const tubeToken = await TubeToken.deploy();
  await tubeToken.waitForDeployment();
  const tokenAddress = await tubeToken.getAddress();
  console.log("TubeToken deployed to:", tokenAddress);

  // 3. Deploy Data Liquidity Pool
  console.log("\n3. Deploying TubeDataPool...");
  const TubeDataPool = await ethers.getContractFactory("TubeDataPool");
  const dataPool = await TubeDataPool.deploy(tokenAddress);
  await dataPool.waitForDeployment();
  const dataPoolAddress = await dataPool.getAddress();
  console.log("TubeDataPool deployed to:", dataPoolAddress);

  // 4. Deploy Governance contract
  console.log("\n4. Deploying TubeGovernance...");
  const TubeGovernance = await ethers.getContractFactory("TubeGovernance");
  const governance = await TubeGovernance.deploy(tokenAddress);
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("TubeGovernance deployed to:", governanceAddress);

  // 5. Deploy TEE Integration contract
  console.log("\n5. Deploying TubeTEEIntegration...");
  const TubeTEEIntegration = await ethers.getContractFactory("TubeTEEIntegration");
  const teeIntegration = await TubeTEEIntegration.deploy(dataPoolAddress);
  await teeIntegration.waitForDeployment();
  const teeAddress = await teeIntegration.getAddress();
  console.log("TubeTEEIntegration deployed to:", teeAddress);

  // Configure contracts
  console.log("\n6. Configuring contracts...");
  
  // Add DataPool as validator for TubeToken
  await tubeToken.addValidator(dataPoolAddress);
  console.log("Added DataPool as token validator");

  // Set TEE integration in DataPool
  await dataPool.setVanaIntegration(registryAddress, teeAddress);
  console.log("Set Vana integration addresses");

  // Verification info
  console.log("\n=== Deployment Summary ===");
  console.log("Registry:", registryAddress);
  console.log("TubeToken (VRC-20):", tokenAddress);
  console.log("TubeDataPool:", dataPoolAddress);
  console.log("TubeGovernance:", governanceAddress);
  console.log("TubeTEEIntegration:", teeAddress);
  
  console.log("\n=== Next Steps ===");
  console.log("1. Update backend .env file with:");
  console.log(`   REGISTRY_CONTRACT_ADDRESS=${registryAddress}`);
  console.log(`   TUBE_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`   DATA_POOL_ADDRESS=${dataPoolAddress}`);
  console.log(`   GOVERNANCE_ADDRESS=${governanceAddress}`);
  console.log(`   TEE_INTEGRATION_ADDRESS=${teeAddress}`);
  console.log("2. Verify all contracts on VanaScan");
  console.log("3. Register with Vana DataRegistry");
  console.log("4. Configure TEE Pool connection");
  
  return {
    registry: registryAddress,
    token: tokenAddress,
    dataPool: dataPoolAddress,
    governance: governanceAddress,
    teeIntegration: teeAddress,
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
