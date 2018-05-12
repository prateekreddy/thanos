'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /loan/request
 */
module.exports = {
    /**
     * summary: This endpoint helps to add an request loan.
     * description: 
     * parameters: loanDetails
     * produces: 
     * responses: 200
     * operationId: 
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/loan/request',
                operation: 'post',
                response: '200'
            }, callback);
        }
    }
};
