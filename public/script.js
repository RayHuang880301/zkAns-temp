let CONTRACT_ADDRESS = "0xa31E9a438DC01c61b9cf7dff75340f7E75060fa9";
let CONTRACT_ABI = [{"inputs":[{"components":[{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"}],"internalType":"struct ZkAns.ZKP","name":"zkp","type":"tuple"},{"internalType":"uint256","name":"ans","type":"uint256"}],"name":"submitAns","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"checkCertificate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
let account;

async function connect() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];
  console.log("account:", account);
  if(account) {
    document.getElementById('connectBtn').innerText = account.split('').slice(0, 6).join('') + '...' + account.split('').slice(-4).join('');
  }
}

async function submit(ans) {
  const r = await calcPrf(ans);
  const get_zk_prf = r.prf;
  const zk_prf = {
    a: [get_zk_prf.pi_a[0], get_zk_prf.pi_a[1]],
    b: [
      [get_zk_prf.pi_b[0][1], get_zk_prf.pi_b[0][0]],
      [get_zk_prf.pi_b[1][1], get_zk_prf.pi_b[1][0]],
    ],
    c: [get_zk_prf.pi_c[0], get_zk_prf.pi_c[1]],
  };

  const web3 = new Web3(window.ethereum);
  const contract = await new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  console.log("zk_prf:", zk_prf)
  const res = await contract.methods.submitAns(zk_prf, r.pub[0]).send({ from: account });
  // await res.wait();
  console.log(res);
  const isCorrect = await contract.methods.checkCertificate().call({ from: account });
  console.log("isCorrect: ", isCorrect);
  if(isCorrect) {
    document.getElementById('box').setAttribute('src', './assets/openBox.png');
  }
};

async function calcPrf (ans) {
  const rnd = Math.floor(Math.random() * 10000000); // a suck random number
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { ans: ans, nonce: rnd },
    "circuit.wasm?ans=" + ans,
    "circuit_final.zkey"
  );
  return { prf: proof, pub: publicSignals };
};