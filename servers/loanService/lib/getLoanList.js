const readContractVariables = require('./readContractVariables');

const getClosedLoansById = (web3, userId, callback) => {
    readContractVariables.getAddressById(web3, userId, (err, address) => {
        if(!err) {
            web3.eth.getPastLogs({
                address,
                topics: []
            }, (err, logs) => {
                if(!err) {
                    callback(null, logs);
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(err, null);
        }
    });
};

const getOpenAndClosedLoansById = (web3, userId, callback) => {
    readContractVariables.getAddressById(web3, userId, (err, address) => {
        if(!err) {
            web3.eth.getPastLogs({
                address,
                topics: []
            }, (err, logs) => {
                if(!err) {
                    callback(null, logs);
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(err, null);
        }
    });
};

const getOpenLoansById = (web3, userId, callback) => {
    let openLoans = [];

    getClosedLoansById(web3, userId, (err, closedLoans) => {
        if(!err) {
            getOpenAndClosedLoansById(web3, userId, (err, openAndClosedLoans) => {
                if(!err) {
                    const openLoans = seperateOpenLoans(openAndClosedLoans, closedLoans);
                    callback(null, openLoans);
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(err, null);
        }
    })

}

const seperateOpenLoans = (completeList, invalidList) => {
    var validList = completedList.filter((item) => {
        return !invalidList.includes(item);
    });
    return validList;
};

module.exports = {
    getClosedLoansById,
    getOpenLoansById
}

