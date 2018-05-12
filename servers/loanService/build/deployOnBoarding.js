const Web3 = require('web3');
const fs = require('fs');

const compiledContracts = require('./compiledContracts.json');
const config = require('../config/config.json');

const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));

const contract = new web3.eth.Contract(JSON.parse(compiledContracts["OnBoarding.sol:OnBoarding"].abi));

contract.deploy({
    data: "0x"+ compiledContracts["OnBoarding.sol:OnBoarding"].bytecode,
    arguments: [config.geth.account.address]
}).send({
    from: config.geth.account.address,
    gas: web3.utils.toHex(9999999),
    gasPrice: web3.utils.toHex(1)
}, console.log).on('receipt', (receipt) => {
    config.onBoardingAddress = receipt.contractAddress;
    fs.writeFileSync('../config/config.json', JSON.stringify(config, null, 2))
    console.log(contract deployed and updated in config);
});