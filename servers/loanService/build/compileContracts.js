const solc = require('solc');
const fs = require('fs');

const contracts = [{
    name: "User.sol",
    path: "../../../blockchain/contracts/User.sol"
}, {
    name: "OnBoarding.sol",
    path: "../../../blockchain/contracts/OnBoarding.sol"
}];

const input = {};

for(let i = 0; i < contracts.length; i++) {
    input[contracts[i].name] = fs.readFileSync(contracts[i].path).toString();
}

const output = solc.compile({sources: input}, 1);

const artifacts = {};

for(let contractName in output.contracts) {
    artifacts[contractName] = {
        bytecode: output.contracts[contractName].bytecode,
        abi: output.contracts[contractName].interface
    };
}

fs.writeFileSync('compiledContracts.json', JSON.stringify(artifacts, null, 2));