const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const token = sequelize.define('token', {
        access_token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        refresh_token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('now')
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('now')
        }
    }, {
        tableName: 'tokens',
        defaultScope: { attributes: { exclude: ['id_user', 'created_at'] } }
    });
    return token;
};