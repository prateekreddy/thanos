const rlp = require('rlp');

const config = require('../config/config.json');
const compiledContracts = require('../build/compiledContracts.json');

const getAddressById = (web3, id, callback) => {
    const onBoardingAddress = config.onBoardingAddress;
    const contract = new web3.eth.Contract(JSON.parse(compiledContracts["OnBoarding.sol:OnBoarding"].abi), config.onBoardingAddress);
    const encodedId = "0x"+rlp.encode(id).toString('hex');
    console.log("finding the address by id "+id);
    contract.methods.users(encodedId).call((err, result) => {
        console.log("got the address")
        if(!err && result.match(/0x[0-9a-fA-F]{40}/g) && result != "0x0000000000000000000000000000000000000000") {
            callback(null, result);
        } else if(result == "0x0000000000000000000000000000000000000000") {
            callback({error: `user with id ${id} does not exist. Please check and try again.`})
        } else {
            callback(err, null);
        }
    })
};

const getReputation = (web3, userId, callback) => {
    console.log(userId);
    getAddressById(web3, userId, (err, address) => {
        if(!err) {
            const userAddress = address;
            const contract = new web3.eth.Contract(JSON.parse(compiledContracts["User.sol:User"].abi), userAddress);
            contract.methods.reputation().call((err, result) => {
                if(!err) {
                    callback(null, result);
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(err, null);
        }
    });
};

const getNonce = (web3, borrower, callback) => {
    getAddressById(web3, borrower, (err, borrowerAddress) => {
        if(!err) {
            const contract = new web3.eth.Contract(JSON.parse(compiledContracts["User.sol:User"].abi), borrowerAddress);
            contract.methods.borrowerNonce().call({from: config.geth.account.address}, (err, result) => {
                if(!err) {
                    callback(null, result);
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(err, null);
        }
    });
};

module.exports = {
    getAddressById,
    getNonce,
    getReputation
}