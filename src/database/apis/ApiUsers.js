const { Op, where } = require('sequelize');
const { models } = require('../dbSequelize');
const constants = require('../../config/constants');

const api = {};

api.getUsers = async({ limit = 12, offset = 0, id_status = 0, except = false, search = false, order = false }) => {
    let options = {};
    let idStatusStatement = {};
    let searchStatement = {};
    if (id_status) {
        idStatusStatement = {
            id_status: {
                [except ? Op.ne : Op.eq]: id_status
            }
        };
    }
    if (search) {
        searchStatement = {
            [Op.or]: [{
                    username: {
                        [Op.like]: '%' + search + '%'
                    }
                },
                {
                    fullname: {
                        [Op.like]: '%' + search + '%'
                    }
                },
                {
                    email: {
                        [Op.like]: '%' + search + '%'
                    }
                }
            ]
        };
    }
    let whereStatement = {
        [Op.and]: [idStatusStatement, searchStatement]
    };
    options.where = whereStatement;
    if (order) {
        let orderStatement = [];
        const orders = order.split(',')
        for (let idx = 0; idx < orders.length; idx++) {
            const elements = orders[idx].split(':');
            orderStatement.push([elements[0], elements[1]]);
        }
        options.order = orderStatement;
    }

    options.limit = limit;
    options.offset = offset;
    const users = await models.user.findAndCountAll(options);
    return users;
};

api.getUserById = async({ id_user, id_status = 0 }) => {
    const whereStatement = api.buildStatement({ field: 'id_user', value: id_user, id_status });
    const user = await models.user.findOne({ where: whereStatement });
    return user;
};

api.getUserByUsername = async({ username, id_status = 0 }) => {
    const whereStatement = api.buildStatement({ field: 'username', value: username, id_status });
    const user = await models.user.findOne({
        where: whereStatement,
        attributes: { include: ['password', 'id_status'] }
    });
    return user;
};

api.getUserByAccessToken = async({ access_token, id_status = 0 }) => {
    const whereStatement = api.buildStatement({ field: null, id_status });
    const user = await models.user.findOne({
        include: [{
            model: models.token,
            where: { 'access_token': access_token },
        }],
        where: whereStatement
    });
    return user;
};

api.getUserByRefreshToken = async({ refresh_token, id_status = 0 }) => {
    const whereStatement = api.buildStatement({ field: null, id_status });
    const user = await models.user.findOne({
        include: [{
            model: models.token,
            where: { 'refresh_token': refresh_token },
        }],
        where: whereStatement
    });
    return user;
};

api.getUserByEmail = async({ email, id_status = 0 }) => {
    const whereStatement = api.buildStatement({ field: 'email', value: email, id_status });
    const user = await models.user.findOne({
        where: whereStatement,
        attributes: { include: ['refresh_token'] }
    });
    return user;
};

api.getUserByPasswordResetToken = async({ password_reset_token, id_status = 0 }) => {
    const whereStatement = api.buildStatement({ field: 'password_reset_token', value: password_reset_token, id_status });
    const user = await models.user.findOne({
        where: whereStatement,
        attributes: { include: ['refresh_token'] }
    });
    return user;
};

api.buildStatement = ({ field, value = null, id_status }) => {
    let statement = {};
    if (field) {
        statement[field] = {
            [Op.eq]: value
        };

    }
    let idStatusStatement = {};
    if (id_status) {
        idStatusStatement = {
            id_status: {
                [Op.eq]: id_status
            }
        };
    }
    let whereStatement = {
        [Op.and]: [statement, idStatusStatement]
    };
    return whereStatement;
};

api.insertUser = async({ newUser }) => {
    const user = await (await models.user.create(newUser)).save();
    const userAux = await models.user.findOne({
        where: { username: newUser.username },
        include: [
            { model: models.role, attributes: ['name'] },
            { model: models.status, attributes: ['name'] }
        ],
    });
    return userAux;
};

api.updateUser = async({ id_user, updateUser }) => {
    const user = await models.user.findOne({ where: { id_user: id_user } });
    user.set(updateUser);
    return await user.save();
};

api.deleteUser = async({ id_user, logic = true }) => {
    if (logic) {
        const userUpdated = await models.user.update({ id_status: constants.STATUS_DELETED }, { where: { id_user: id_user } });
        return userUpdated;
    } else {
        // TODO destroy register in the database
    }
};

api.deactivateUser = async({ id_user }) => {
    const userUpdated = await models.user.update({ id_status: constants.STATUS_DEACTIVATED }, { where: { id_user: id_user } });
    return userUpdated;
};

api.activateUser = async({ id_user }) => {
    const userUpdated = await models.user.update({ id_status: constants.STATUS_ACTIVATED }, { where: { id_user: id_user } });
    return userUpdated;
};

api.checkRole = async({ id_user, id_role }) => {
    const checkedUser = await models.user.findOne({ where: { id_user, id_role }, });
    if (checkedUser) { return true }
    return false;
}

api.isSuperadmin = async({ id_user }) => {
    const id_role = constants.ROLE_SUPERADMIN; // ID de Rol Superadmin
    const isSuperadmin = await api.checkRole({ id_user, id_role });
    return isSuperadmin;
}

api.isAdmin = async({ id_user }) => {
    const id_role = constants.ROLE_ADMIN; // ID de Rol Admin
    const isAdmin = await api.checkRole({ id_user, id_role });
    return isAdmin;
}

api.isUser = async({ id_user }) => {
    const id_role = constants.ROLE_USER; // ID de Rol Usuario
    const isUser = await api.checkRole({ id_user, id_role });
    return isUser;
}

module.exports = api;