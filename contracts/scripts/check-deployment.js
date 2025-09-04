const { ethers } = require("hardhat");

async function main() {
  const txHash = "0xa36945a19c6f7223ce86a4c6249faa0d67566e5ebee198b097bde6bc74d6bbc9";
  
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  
  if (!receipt) {
    console.error("Transaction not found");
    return;
  }

  for (let i = 0; i < receipt.logs.length; i++) {
    const log = receipt.logs[i];
    
    if (log.topics.length >= 3 && log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
      const tokenAddress = log.address;
      console.log("Token deployed successfully");
      console.log("Address:", tokenAddress);
      
      try {
        const tokenContract = await ethers.getContractAt("ERC20", tokenAddress);
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        const totalSupply = await tokenContract.totalSupply();
        const decimals = await tokenContract.decimals();
        
        console.log("Name:", name);
        console.log("Symbol:", symbol);
        console.log("Decimals:", decimals);
        console.log("Total Supply:", ethers.formatEther(totalSupply), symbol);
        
        const deploymentInfo = {
          network: "moksha",
          tokenAddress: tokenAddress,
          txHash: txHash,
          blockNumber: receipt.blockNumber,
          timestamp: new Date().toISOString(),
          tokenDetails: {
            name,
            symbol,
            decimals,
            totalSupply: totalSupply.toString()
          }
        };
        
        const fs = require("fs");
        fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
        
      } catch (error) {
        console.log("Could not read token details:", error.message);
      }
      
      break;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
