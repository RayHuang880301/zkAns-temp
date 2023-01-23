const fs = require('fs');
const exec = require('child_process').exec;

export const genWasm = async (ans: any, callbackfn: () => {}) => {
    //write file sync
    await fs.writeFileSync('ans-circuits/circuit.circom',
        "pragma circom 2.0.2;\n" + 
        "include \"./../node_modules/circomlib/circuits/poseidon.circom\";\n" + 
        "\n" + 
        "template Ans(){\n" + 
        "    signal input ans;\n" + 
        "    signal input nonce;\n" + 
        "    signal output commitment <== Poseidon(2)([ans, nonce]);\n" + 
        "    signal one <== 1;\n" + 
        "\n" + 
        "    ans === one * " + ans + ";\n" + 
        "}" + 
        "component main = Ans();"
    );
    await exec(
        'circom ./ans-circuits/circuit.circom --wasm -o ans-circuits',
        (error: any, stdout: any, stderr: any) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null)
                console.log(`ERROR: ${error}`);
            callbackfn();
        });
};