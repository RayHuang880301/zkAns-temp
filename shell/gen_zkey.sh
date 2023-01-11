FILE=ptau/pot_final.ptau
if test -f "$FILE"; then
    [ ! -f ./circuits ] && mkdir -p ./circuits
    [ ! -f ./circuits/setup ] && mkdir -p ./circuits/setup
    echo  "pragma circom 2.0.2;" >./circuits/circuit.circom
    echo  "include \"./../node_modules/circomlib/circuits/poseidon.circom\";" >>./circuits/circuit.circom
    echo  "" >>./circuits/circuit.circom
    echo  "template Ans(){" >>./circuits/circuit.circom
    echo  "    signal input ans;" >>./circuits/circuit.circom
    echo  "    signal input nonce;" >>./circuits/circuit.circom
    echo  "    signal output commitment <== Poseidon(2)([ans, nonce]);" >>./circuits/circuit.circom
    echo  "    signal one <== 1;" >>./circuits/circuit.circom
    echo  "" >>./circuits/circuit.circom
    echo  "    ans === one * $1;" >>./circuits/circuit.circom
    echo  "}" >>./circuits/circuit.circom
    echo  "component main = Ans();" >>./circuits/circuit.circom

    #build
    circom ./circuits/circuit.circom --r1cs --wasm --sym -o ./circuits/

    #G
    snarkjs groth16 setup ./circuits/circuit.r1cs "$FILE" circuits/setup/circuit_0000.zkey
    (echo y | snarkjs zkey contribute circuits/setup/circuit_0000.zkey circuits/setup/circuit_0001.zkey --name="1st Contributor Name" -v)
    snarkjs zkey contribute circuits/setup/circuit_0001.zkey circuits/setup/circuit_0002.zkey --name="Second contribution Name" -v -e="Another random entropy"
    snarkjs zkey export bellman circuits/setup/circuit_0002.zkey  circuits/setup/challenge_phase2_0003
    snarkjs zkey bellman contribute bn128 circuits/setup/challenge_phase2_0003 circuits/setup/response_phase2_0003 -e="some random text"
    snarkjs zkey import bellman circuits/setup/circuit_0002.zkey circuits/setup/response_phase2_0003 circuits/setup/circuit_0003.zkey -n="Third contribution name"
    snarkjs zkey beacon circuits/setup/circuit_0003.zkey root/circuit_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"
    snarkjs zkey export verificationkey root/circuit_final.zkey root/verification_key.json
    snarkjs zkey export solidityverifier root/circuit_final.zkey contracts/verifier.sol

    sed -i "14c pragma solidity ^0.8.9;" contracts/verifier.sol
else
    echo "ERROR: $FILE does not exist."
fi