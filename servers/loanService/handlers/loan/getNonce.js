'use strict';
var dataProvider = require('../../data/loan/getNonce.js');
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
     */
    post: function (req, reply, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['post']['200'];
        provider(req, reply, function (err, data) {
            if (err) {
                reply(err);
                return;
            }
            reply(data).code(status);
        });
    }
};
