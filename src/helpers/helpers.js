const bcrypt = require('bcryptjs');
const randomString = require('crypto-random-string');
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

helpers.createRandomString = ({ length = 32 }) => {
    const random = randomString(length);
    const time = new Date().getTime();
    const token = random + '_' + time;
    return token;
};

helpers.isPasswordResetTokenValid = ({ token = '' }) => {
    if (token === null || token.length === 0) {
        return false;
    }
    const time_valid = constants.USER_PASSWORD_RESET_TOKEN_EXPIRE;
    const created_at = token.substr(token.indexOf('_') + 1);
    const current_time = new Date().getTime();
    return parseInt(time_valid) + parseInt(created_at) >= current_time;
};

helpers.filterCategories = ({ categories = [], filter = [], intersection = true }) => {
    if (typeof categories === 'string') {
        categories = [categories];
    }
    if (typeof filter === 'string') {
        filter = [filter];
    }
    return categories.filter(category => {
        const cat = typeof category === 'object' ? category.id_category : category;
        return intersection ?
            filter.find(categorySelected => {
                const id_cat = typeof categorySelected === 'object' ? categorySelected.id_category : categorySelected;
                return id_cat == cat;

            }) : !filter.find(categorySelected => {
                const id_cat = typeof categorySelected === 'object' ? categorySelected.id_category : categorySelected;
                return id_cat == cat;
            });
    });
};

module.exports = helpers;