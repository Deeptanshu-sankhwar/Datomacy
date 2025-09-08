const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const DAT_FACTORY_ADDRESS = process.env.DAT_FACTORY_ADDRESS || "0x40f8bccF35a75ecef63BC3B1B3E06ffEB9220644";
  
  const tokenParams = {
    datType: 1,
    name: "TubeDAO Token",
    symbol: "TUBE",
    owner: deployer.address,
    cap: ethers.parseEther("1000000000"),
    schedules: [
      {
        beneficiary: deployer.address,
        start: Math.floor(Date.now() / 1000),
        cliff: 0,
        duration: 31556926,
        amount: ethers.parseEther("100000000")
      }
    ],
    salt: "0x0000000000000000000000000000000000000000000000000000000000000000"
  };

  const datFactoryABI = [
    "function createToken((uint8 datType, string name, string symbol, address owner, uint256 cap, (address beneficiary, uint64 start, uint64 cliff, uint64 duration, uint256 amount)[] schedules, bytes32 salt)) external returns (address token, address[] vesting)"
  ];
  
  const datFactory = new ethers.Contract(DAT_FACTORY_ADDRESS, datFactoryABI, deployer);
  
  try {
    const tx = await datFactory.createToken(tokenParams);
    const receipt = await tx.wait();

    const datCreatedEvent = receipt.logs.find(log => {
      try {
        const parsed = datFactory.interface.parseLog(log);
        return parsed.name === "DATCreated";
      } catch {
        return false;
      }
    });

    if (datCreatedEvent) {
      const parsedEvent = datFactory.interface.parseLog(datCreatedEvent);
      const tokenAddress = parsedEvent.args.token;
      
      console.log("Token deployed successfully");
      console.log("Address:", tokenAddress);
      
      const deploymentInfo = {
        network: "moksha",
        tokenAddress: tokenAddress,
        deployer: deployer.address,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        timestamp: new Date().toISOString(),
        params: tokenParams
      };
      
      const fs = require("fs");
      fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
      
    } else {
      console.error("DATCreated event not found");
    }

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
