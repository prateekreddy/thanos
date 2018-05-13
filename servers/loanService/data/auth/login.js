const user = require('../../models/config.models.users');
/**
 * Operations on /auth/login
 */

 // sample request: curl -X POST --data '{"phNo": "1234531234654", "password": "test1"}' -H "Content-Type: application/json" localhost:8000/auth/login

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
