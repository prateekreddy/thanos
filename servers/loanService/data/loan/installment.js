'use strict';
var Mockgen = require('../mockgen.js');
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
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/loan/installment',
                operation: 'post',
                response: '200'
            }, callback);
        }
    }
};
