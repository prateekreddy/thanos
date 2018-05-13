const user = require('../../models/config.models.users');
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
            const phoneNumber = req.payload.phNo;
            const password = req.payload.password;

            // check login
            user.where({ phoneNumber }).findOne((err, user) => {
                if(err || !user) {
                    callback({err: "User not found. Please register before logging in"});
                } else {
                    if(user.password == password) {
                        callback(null, {login: true});
                    } else {
                        callback({err: "Password or Phone number incorrect, please check and try again."}, null);
                    }
                }
            })
        }
    }
};
