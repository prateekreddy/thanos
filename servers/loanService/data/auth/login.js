'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /auth/login
 */
module.exports = {
    /**
     * summary: This endpoint helps to login into the application.
     * description: 
     * parameters: loginDetails
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
                path: '/auth/login',
                operation: 'post',
                response: '200'
            }, callback);
        }
    }
};
