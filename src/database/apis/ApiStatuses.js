const { models } = require('../dbSequelize');
const api = {};

api.getStatus = async({}) => {
    let options = {};
    const status = await models.status.findAndCountAll(options);
    return status;
};

api.getStatusById = async({ id_status = 0 }) => {
    const status = await models.status.findOne({ where: { id_status } });
    return status;
};

module.exports = api;