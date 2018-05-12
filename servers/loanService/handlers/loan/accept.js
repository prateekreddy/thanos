'use strict';
var dataProvider = require('../../data/loan/accept.js');
/**
 * Operations on /loan/accept
 */
module.exports = {
    /**
     * summary: This endpoint helps to add an bank account to the application.
     * description: 
     * parameters: loanAcceptDetails
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
                next(err);
                return;
            }
            reply(data && data.responses).code(status);
        });
    }
};
