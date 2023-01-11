// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./verifier.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract ZkAns {
    Verifier public verifier;
    struct ZKP {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }

    mapping(address => bool) public certificates;

    constructor(address _verifier) {
        verifier = Verifier(_verifier);
    }

    function submitAns(ZKP memory zkp, uint256 ans) public {
        bool suc = verifier.verifyProof(zkp.a, zkp.b, zkp.c, [ans]);
        if (suc) certificates[msg.sender] = true;
    }

    function checkCertificate() public view returns (bool) {
        return certificates[msg.sender];
    }
}
