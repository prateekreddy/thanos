const Web3 = require("web3");

const readContractVariables = require('../../lib/readContractVariables');
const config = require("../../config/config.json");

const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));
/**
 * Operations on /loan/getEthTxNonce
 */
module.exports = {
    /**
     * summary: This endpoint helps to add an bank account to the application.
     * description: 
     * parameters: accountDetails
     * produces: 
     * responses: 200
     * operationId: 
     */
    post: {
        200: function (req, res, callback) {
            const address = req.payload.address;

            web3.eth.getTransactionCount(address, (err, nonce) => {
                callback(err, nonce);
            });
        }
    }
};
