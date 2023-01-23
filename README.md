# ZK-ANS

```shell
#
npm i
# --------
#set up
#set up .env
#gen zkey with ans: $answer
shell/gen_zkey.sh $answer
#change verifier.sol solc version to 0.8.9
#deploy contract
npx hardhat run scripts/deploy.ts --network goerli
#verify contract (optional)
npx hardhat verify --network goerli $address
# update contract address in public/scripts.js

# --------
#run server
npx ts-node scripts/server.ts
```
