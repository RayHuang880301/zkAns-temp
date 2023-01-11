module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("ZkAns", {
        from: deployer,
        log: true,
        args: ["0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],
    })
    await deploy("Verifier", {
        from: deployer,
        log: true,
        args: [],
    })
    log("deploy suc!");
}
module.exports.tags = ["all"]