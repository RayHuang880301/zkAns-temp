import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "../lib/ZkAns-deploy";

describe("H1-Test Sample", () => {
    describe("H2-Test Sample", () => {
        describe("H3-Test Sample", () => {
            it("p", async () => {
                const sample = await deploy();
                console.log(sample.address);
                return sample;
            })
        })
    })
})