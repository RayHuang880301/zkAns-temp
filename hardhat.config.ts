import { HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`,
      accounts: [getString(process.env.POLYGON_PRIVATE_KEY)],
  },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_API_KEY}`,
      accounts: [getString(process.env.GOERLI_PRIVATE_KEY)],
  },
  },
  etherscan: {
    apiKey: {
      goerli: getString(process.env.ETHERSCAN_API_KEY),
      polygon: getString(process.env.POLYGONSCAN_API_KEY),
    },
  },
  typechain: {
    // outDir: 'types',
    target: 'ethers-v5',
  }
};

function getString(value: any, defaultValue?: string) {
  if (typeof value === 'string') return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing environment variable`);
}

export default config;
