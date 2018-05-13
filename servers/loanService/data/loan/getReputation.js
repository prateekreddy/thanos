const Web3 = require("web3");

const readContractVariables = require('../../lib/readContractVariables');
const config = require("../../config/config.json");

const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));
/**
 * Operations on /loan/getReputation
 */
module.exports = {
    /**
     * summary: This endpoint gives the reputation given the userId
     * description: 
     * parameters: userId
     * produces: 
     * responses: 200
     * operationId: 
     */
    get: {
        200: function (req, res, callback) {
            const userId = req.query.userId;

            readContractVariables.getReputation(web3, userId, callback);
        }
    }
};
