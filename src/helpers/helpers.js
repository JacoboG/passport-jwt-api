const bcrypt = require('bcryptjs');
const constants = require('./../config/constants');
const helpers = {};

helpers.encryptPassword = ({ password, rounds }) => {
    const salt = bcrypt.genSaltSync(rounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

helpers.matchPassword = (password, savedPassword) => {
    try {
        return bcrypt.compareSync(password, savedPassword);
    } catch (error) {
        return false;
    }
};

module.exports = helpers;