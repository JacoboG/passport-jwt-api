const apiHelpers = require('./apis/ApiHelpers');
const apiRoles = require('./apis/ApiRoles');
const apiStatus = require('./apis/ApiStatuses');
const apiUsers = require('./apis/ApiUsers');
const apiTokens = require('./apis/ApiTokens');

const api = {
    ...apiHelpers,
    ...apiRoles,
    ...apiStatus,
    ...apiUsers,
    ...apiTokens
};

module.exports = api;