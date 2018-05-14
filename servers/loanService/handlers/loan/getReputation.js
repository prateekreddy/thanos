'use strict';
var dataProvider = require('../../data/loan/getReputation.js');
/**
 * Operations on /loan/getReputation
 */
module.exports = {
    /**
     * summary: This endpoint gives the reputation given the userId
     * description: 
     * parameters: userId
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
                reply(err).code(403);
                return;
            }
            reply(data).code(status);
        });
    }
};
