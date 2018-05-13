const uuid = require('shortid');

module.exports = () => {
    return uuid.generate().replace('_', '').replace('-', '');
}