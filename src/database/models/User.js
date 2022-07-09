const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const user = sequelize.define('user', {
        id_user: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        fullname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password_reset_token: {
            type: DataTypes.STRING(255),
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
        tableName: 'users',
        defaultScope: { attributes: { exclude: ['password', 'access_token', 'refresh_token', 'password_reset_token', 'id_role', 'id_status'] } }
    });
    return user;
};