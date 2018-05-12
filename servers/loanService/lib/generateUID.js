const uuid = require('uuid');

module.exports = () => {
    return uuid.generate().replace('_', '').replace('-', '');
}