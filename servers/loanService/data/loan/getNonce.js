const Web3 = require("web3");

const readContractVariables = require('../../lib/readContractVariables');
const config = require("../../config/config.json");

const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));

/**
 * Operations on /loan/getNonce
 */
module.exports = {
    /**
     * summary: This endpoint gives the number of loan taken till now.
     * description: 
     * parameters: borrower
     * produces: 
     * responses: 200
     * operationId: 
     */
    get: {
        200: function (req, res, callback) {
            const borrower = req.query.borrower;

            readContractVariables.getNonce(web3, borrower, callback);
        }
    }
};
