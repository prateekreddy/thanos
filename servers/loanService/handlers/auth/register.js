'use strict';
var dataProvider = require('../../data/auth/register.js');
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
                console.log(err);
                reply(err).code(403);
                return;
            }
            reply(data).code(status);
        });
    }
};
