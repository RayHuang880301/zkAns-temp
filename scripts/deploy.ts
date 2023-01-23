import { ethers } from "hardhat";
import type { ZkAns } from "../typechain-types";

const main = async () => {
    const ZkAns = await ethers.getContractFactory("ZkAns");
    const zkAns = await ZkAns.deploy() as ZkAns;
    await zkAns.deployed();
    console.log("ZkAns deployed to:", zkAns.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});