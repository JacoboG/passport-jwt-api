const { Op } = require('sequelize');
const { models } = require('../dbSequelize');
const constants = require('../../config/constants');

const api = {};

api.getTokenByAccessToken = async({ access_token }) => {
    const token = await models.token.findOne({
        where: { access_token }
    });
    return token;
};

api.getTokenByRefreshToken = async({ refresh_token }) => {
    const token = await models.token.findOne({
        where: { refresh_token }
    });
    return token;
};

api.getTokensByUser = async({ id_user }) => {
    const tokens = await models.token.findAndCountAll({
        where: { id_user: id_user }
    });
    return tokens;
};

api.insertToken = async({ newToken }) => {
    const token = await (await models.token.create(newToken)).save();
    const tokenAux = await models.token.findOne({
        where: { access_token: newToken.access_token }
    });
    return tokenAux;
};

api.updateTokenByAccessToken = async({ access_token, updateToken }) => {
    const token = await models.token.findOne({ where: { access_token: access_token }, attributes: { include: ['id_token'] } });
    if (token) {
        updateToken.id_token = token.id_token;
        token.set(updateToken);
        return await token.save();
    }
    return false;
};

api.updateTokenByRefreshToken = async({ refresh_token, updateToken }) => {
    const token = await models.token.findOne({ where: { refresh_token: refresh_token }, attributes: { include: ['id_token'] } });
    if (token) {
        updateToken.id_token = token.id_token;
        token.set(updateToken);
        return await token.save();
    }
    return false;
};

api.deleteToken = async({ access_token }) => {
    const tokenUpdated = await models.token.destroy({ where: { access_token: access_token } });
    return tokenUpdated;
};

api.deleteTokenByAccessToken = async({ access_token }) => {
    const tokenDestroyed = await models.token.destroy({ where: { access_token } });
    return tokenDestroyed;
};

api.deleteTokenByRefreshToken = async({ refresh_token }) => {
    const tokenDestroyed = await models.token.destroy({ where: { refresh_token } });
    return tokenDestroyed;
};

module.exports = api;