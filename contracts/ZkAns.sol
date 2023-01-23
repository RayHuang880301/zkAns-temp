// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./verifier.sol";

contract ZkAns is Verifier {
    struct ZKP {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }

    mapping(address => bool) public certificates;

    constructor() {}

    function submitAns(ZKP memory zkp, uint256 ans) public {
        bool isCorrect = verifyProof(zkp.a, zkp.b, zkp.c, [ans]);
        certificates[msg.sender] = isCorrect;
    }

    function checkCertificate() public view returns (bool) {
        return certificates[msg.sender];
    }
}
