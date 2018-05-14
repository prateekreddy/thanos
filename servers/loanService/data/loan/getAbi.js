const compiledContracts = require('../../build/compiledContracts.json');
/**
 * Operations on /loan/getAbi
 */
module.exports = {
    /**
     * summary: This endpoint helps to add an bank account to the application.
     * description: 
     * parameters: entityDetails
     * produces: 
     * responses: 200
     * operationId: 
     */
    post: {
        200: function (req, res, callback) {
            const entityType = req.payload.entityType;

            if(entityType == 'user') {
                callback(null, compiledContracts["User.sol:User"].abi);
            } else if(entityType == 'onBoarding') {
                callback(null, compiledContracts["OnBoarding.sol:OnBoarding"].abi);
            } else {
                callback({err: "Requested ABI definition not available"}, null);
            }
        }
    }
};
