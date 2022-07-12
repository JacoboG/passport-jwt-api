const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const token = sequelize.define('token', {
        id_token: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        access_token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
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
        defaultScope: { attributes: { exclude: ['id_token', 'id_user', 'created_at', 'updated_at'] } }
    });
    return token;
};