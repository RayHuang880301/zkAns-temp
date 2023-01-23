const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

export const genWasm = async (ans: any, callbackfn: (wasmPath: string) => {}) => {
    //write file sync
    const filename = `circuit-${ans}.circom`
    const filepath = path.resolve(__dirname, `../ans-circuits/${filename}`)
    console.log({
        filepath
    })
    
    await fs.writeFileSync(filepath,
        `pragma circom 2.0.2;
        include "../node_modules/circomlib/circuits/poseidon.circom";

        template Ans(){
            signal input ans;
            signal input nonce;
            signal output commitment <== Poseidon(2)([ans, nonce]);
            signal one <== 1;

            ans === one *  ${ans};
        }
        component main = Ans();
        `
    );
    const wasmPath = path.resolve(__dirname, `../ans-circuits/circuit-${ans}_js/circuit-${ans}.wasm`);
    await exec(
        `circom ${filepath} --wasm -o ans-circuits`,
        (error: any, stdout: any, stderr: any) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null)
                console.log(`ERROR: ${error}`);
            callbackfn(wasmPath);
        });
    return wasmPath;
};