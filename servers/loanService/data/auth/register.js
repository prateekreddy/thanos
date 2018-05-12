'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /auth/register
 */
module.exports = {
    /**
     * summary: This endpoint helps to register with the application.
     * description: This endpoint helps to register with application

     * parameters: registrationDetails
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
                path: '/auth/register',
                operation: 'post',
                response: '200'
            }, callback);
        }
    }
};
