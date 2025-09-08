# TubeDAO Token Deployment Guide

This guide walks you through deploying the TubeDAO token on Vana Moksha testnet using the official DATFactory contract.

## Prerequisites

1. **Setup Wallet for Vana Moksha Testnet**
   - Network Name: Vana Moksha Testnet
   - RPC URL: `https://rpc.moksha.vana.org`
   - Chain ID: 14800
   - Currency Symbol: VANA
   - Block Explorer: `https://moksha.vanascan.io`

2. **Get Testnet VANA**
   - Visit [Vana Faucet](https://faucet.vana.org/)
   - Request testnet VANA tokens for gas fees

## Step 1: Setup Environment

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file and add your private key:
   ```bash
   PRIVATE_KEY=your_private_key_without_0x_prefix
   DAT_FACTORY_ADDRESS=0x40f8bccF35a75ecef63BC3B1B3E06ffEB9220644
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Deploy Token via DATFactory

Deploy using the official Vana DATFactory:

```bash
npx hardhat run scripts/deploy-datfactory.js --network moksha
```

This will:
- Deploy a VRC-20 compliant token with governance features
- Set up vesting schedules
- Return the token contract address
- Save deployment info to `deployment-info.json`

## Step 4: Verify Deployment

1. Check the transaction on [Moksha VanaScan](https://moksha.vanascan.io)
2. Find the `DATCreated` event in transaction logs
3. Note the token contract address
4. The token will be automatically verified as it's deployed via DATFactory

## Token Parameters

- **Name**: TubeDAO Token
- **Symbol**: TUBE
- **Type**: VOTES (includes governance features)
- **Max Supply**: 1,000,000,000 TUBE
- **Initial Allocation**: 100,000,000 TUBE (vested over 1 year)

## Alternative: Manual Deployment via VanaScan

1. Go to [DATFactory on VanaScan](https://moksha.vanascan.io/address/0x40f8bccF35a75ecef63BC3B1B3E06ffEB9220644)
2. Connect your wallet
3. Go to "Contract" → "Write as Proxy"
4. Find `createToken` function
5. Enter these parameters:

```json
{
  "datType": 1,
  "name": "TubeDAO Token",
  "symbol": "TUBE", 
  "owner": "YOUR_WALLET_ADDRESS",
  "cap": "1000000000000000000000000000",
  "schedules": [
    {
      "beneficiary": "YOUR_WALLET_ADDRESS",
      "start": 1734700800,
      "cliff": 0,
      "duration": 31556926,
      "amount": "100000000000000000000000000"
    }
  ],
  "salt": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

## Post-Deployment

1. **Save the token address** from deployment logs
2. **Update backend configuration** with the new token address
3. **Associate with DataDAO** - Link token to your DataDAO contract
4. **Submit for verification** - Follow Vana Foundation's review process

## Troubleshooting

- **Transaction failed**: Check you have enough VANA for gas
- **Wrong network**: Ensure you're connected to Moksha testnet
- **Invalid parameters**: Verify all addresses and amounts are correct
- **DATFactory address**: Check latest address on VanaScan if deployment fails
