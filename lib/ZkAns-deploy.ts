import { ethers } from "hardhat";

export const deploy = async () => {
    let contract = await (await ethers.getContractFactory("ZkAns")).deploy(2);
    return contract;
}