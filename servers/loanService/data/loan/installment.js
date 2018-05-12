/**
 * Operations on /loan/installment
 */
module.exports = {
    /**
     * summary: This endpoint helps to add an bank account to the application.
     * description: 
     * parameters: installmentDetails
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
