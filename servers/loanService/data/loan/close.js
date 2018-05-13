const Web3 = require("web3");

const config = require("../../config/config.json");

const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));
/**
 * Operations on /loan/close
 */
module.exports = {
    /**
     * summary: This endpoint helps to add an bank account to the application.
     * description: 
     * parameters: loanCloseDetails
     * produces: 
     * responses: 200
     * operationId: 
     */
    post: {
        200: function (req, res, callback) {
            const signedTx = req.payload.signedTx;

            web3.eth.sendSignedTransaction(signedTx).on('receipt', (receipt) => {
                callback(null, receipt);
            });
        }
    }
};
