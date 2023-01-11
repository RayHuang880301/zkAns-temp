import { deploy } from "../lib/ZkAns-deploy";

const main = async () => {
    const sample = await deploy();
    console.log(sample.address);
    return sample;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});