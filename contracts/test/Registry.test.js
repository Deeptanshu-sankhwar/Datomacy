const { expect } = require("chai");
const { ethers } = require("hardhat");

// Helper function to parse ether
const parseEther = (amount) => ethers.parseEther(amount.toString());

describe("Registry", function () {
  let Registry;
  let registry;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy Registry contract
    Registry = await ethers.getContractFactory("Registry");
    registry = await Registry.deploy();
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should register the deployer as the first member", async function () {
      expect(await registry.isMember(owner.address)).to.equal(true);
    });

    it("Should set initial registration fee to zero", async function () {
      expect(await registry.registrationFee()).to.equal(0);
    });

    it("Should have 1 total member initially", async function () {
      expect(await registry.getTotalMembers()).to.equal(1);
    });
  });

  describe("Registration", function () {
    it("Should allow free registration", async function () {
      await expect(registry.connect(addr1).register())
        .to.emit(registry, "MemberRegistered");

      expect(await registry.isMember(addr1.address)).to.equal(true);
      expect(await registry.getTotalMembers()).to.equal(2);
    });

    it("Should fail registration if already a member", async function () {
      // Register first time
      await registry.connect(addr1).register();
      
      // Try to register again
      await expect(
        registry.connect(addr1).register()
      ).to.be.revertedWith("Registry: Caller is already a member");
    });

    it("Should allow multiple users to register", async function () {
      await registry.connect(addr1).register();
      await registry.connect(addr2).register();
      
      expect(await registry.isMember(addr1.address)).to.equal(true);
      expect(await registry.isMember(addr2.address)).to.equal(true);
      expect(await registry.getTotalMembers()).to.equal(3);
    });

    it("Should not require any payment for registration", async function () {
      const initialBalance = await ethers.provider.getBalance(addrs[0].address);
      
      const tx = await registry.connect(addrs[0]).register();
      const receipt = await tx.wait();
      
      const finalBalance = await ethers.provider.getBalance(addrs[0].address);
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      
      // Final balance should be initial - gas cost only (no registration fee)
      expect(finalBalance).to.equal(initialBalance - gasCost);
      expect(await registry.isMember(addrs[0].address)).to.equal(true);
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to register member without fee", async function () {
      await expect(registry.connect(owner).registerMember(addr1.address))
        .to.emit(registry, "MemberRegistered");

      expect(await registry.isMember(addr1.address)).to.equal(true);
    });

    it("Should allow owner to remove member", async function () {
      await registry.connect(addr1).register();
      
      await expect(registry.connect(owner).removeMember(addr1.address))
        .to.emit(registry, "MemberRemoved");

      expect(await registry.isMember(addr1.address)).to.equal(false);
      expect(await registry.getTotalMembers()).to.equal(1);
    });

    it("Should prevent owner from removing themselves", async function () {
      await expect(
        registry.connect(owner).removeMember(owner.address)
      ).to.be.revertedWith("Registry: Cannot remove owner");
    });

    it("Should allow owner to update registration fee", async function () {
      const newFee = parseEther("0.02");
      
      await expect(registry.connect(owner).updateRegistrationFee(newFee))
        .to.emit(registry, "RegistrationFeeUpdated")
        .withArgs(0, newFee);

      expect(await registry.registrationFee()).to.equal(newFee);
    });

    it("Should allow owner to update reputation", async function () {
      await registry.connect(addr1).register();
      
      await registry.connect(owner).updateReputation(addr1.address, 150);
      expect(await registry.getReputation(addr1.address)).to.equal(150);
    });

    it("Should allow owner to withdraw ETH", async function () {
      // Send some ETH to the contract
      await owner.sendTransaction({
        to: await registry.getAddress(),
        value: parseEther("0.1")
      });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await registry.connect(owner).withdrawETH();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("View Functions", function () {
    it("Should return correct registration timestamp", async function () {
      await registry.connect(addr1).register();
      
      const timestamp = await registry.getRegistrationTimestamp(addr1.address);
      expect(timestamp).to.be.gt(0);
    });

    it("Should return default reputation for new members", async function () {
      await registry.connect(addr1).register();
      
      expect(await registry.getReputation(addr1.address)).to.equal(100);
    });

    it("Should fail to get timestamp for non-member", async function () {
      await expect(
        registry.getRegistrationTimestamp(addr1.address)
      ).to.be.revertedWith("Registry: Address is not a member");
    });

    it("Should fail to get reputation for non-member", async function () {
      await expect(
        registry.getReputation(addr1.address)
      ).to.be.revertedWith("Registry: Address is not a member");
    });
  });

  describe("Access Control", function () {
    it("Should prevent non-owner from registering members", async function () {
      await expect(
        registry.connect(addr1).registerMember(addr2.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from removing members", async function () {
      await registry.connect(addr1).register();
      
      await expect(
        registry.connect(addr1).removeMember(addr2.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from updating fee", async function () {
      await expect(
        registry.connect(addr1).updateRegistrationFee(parseEther("0.02"))
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from updating reputation", async function () {
      await expect(
        registry.connect(addr1).updateReputation(addr2.address, 150)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from withdrawing ETH", async function () {
      await expect(
        registry.connect(addr1).withdrawETH()
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });
});
