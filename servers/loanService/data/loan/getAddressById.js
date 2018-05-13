const Web3 = require("web3");

const readContractVariables = require('../../lib/readContractVariables');
const config = require("../../config/config.json");

const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));

/**
 * Operations on /loan/getAddressById
 */
module.exports = {
    /**
     * summary: This endpoint gives the number of loan taken till now.
     * description: 
     * parameters: Id
     * produces: 
     * responses: 200
     * operationId: 
     */
    get: {
        200: function (req, res, callback) {
            const id = req.query.Id;

            readContractValues.getAddressById(web3, id, callback);
        }
    }
};
