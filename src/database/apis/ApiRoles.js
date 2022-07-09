const { models } = require('../dbSequelize');
const api = {};

api.getRoles = async() => {
    let options = {};
    const roles = await models.role.findAndCountAll(options);
    return roles;
};

api.getRoleById = async({ id_role }) => {
    const role = await models.role.findOne({ where: { id_role } });
    return role;
};

module.exports = api;