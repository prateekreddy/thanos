const Web3 = require("web3");
const rlp = require("rlp");

const uid = require('../../lib/generateUID')
const user = require('../../models/config.models.users');
const config = require('../../config/config.json');
const compiledContracts = require('../../build/compiledContracts.json');
const readContractVariables = require('../../lib/readContractVariables');

const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));

/**
 * Operations on /auth/register
 */

const checkIfUserExists = (phoneNumber, callback) => {
    user.where({ phoneNumber }).findOne((err, user) => {
        if(err) {
            callback({err: "Error creating user. Please try again."}, null);
        } else if(user) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
}

module.exports = {
    /**
     * summary: This endpoint helps to register with the application.
     * description: This endpoint helps to register with application

     * parameters: registrationDetails
     * produces: 
     * responses: 200
     * operationId: 
     */
    post: {
        200: function (req, res, callback) {
            const name = req.payload.name;
            const phoneNumber = req.payload.phNo;
            const userKey = req.payload.userKey;
            const password = req.payload.password;

            checkIfUserExists(phoneNumber, (err, ifExists) => {
                if(err) {
                    callback(err, null);
                } else if(ifExists) {
                    // create user contract
                    const onBoardingAddress = config.onBoardingAddress;
                    const onBoardingContract = new web3.eth.Contract(JSON.parse(compiledContracts["OnBoarding.sol:OnBoarding"].abi), onBoardingAddress);
                    const userId = uid();
                    const encodedUserId = "0x"+rlp.encode(userId).toString('hex');
                    console.log(encodedUserId, userKey);
                    onBoardingContract.methods.createUser(encodedUserId, userKey).send({
                        from: config.geth.account.address,
                        gas: web3.utils.toHex(99999999)
                    }).on('receipt', (receipt) => {
                        console.log(receipt)
                        if(receipt.status) {
                            readContractVariables.getAddressById(web3, userId, (err, res) => {
                                console.log("Im here")
                                if(!err) {
                                    user.create({
                                        name,
                                        phoneNumber,
                                        password,
                                        contractAddress: res
                                    }, (err, result) => {
                                        if(err) {
                                            console.log(err)
                                            callback(err, null);
                                        } else {
                                            callback(null, {userId, status: "Registered"});
                                        }
                                    })
                                } else {
                                    console.log(err);
                                    callback({err: "error creating user, Please try again."}, null);
                                }
                            })
                        } else {
                            callback(err);
                            callback({err: "user creation failed. Please try again."}, null);
                        }
                    }).on('error', (err, receipt) => {
                        console.log(err);
                        callback(err, receipt);
                    });
                } else {
                    callback({err: "User already exists. Please login."}, null);
                }
            });
        }
    }
};