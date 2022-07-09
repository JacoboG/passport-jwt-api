const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const role = sequelize.define('role', {
        id_role: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'Sin Descripción'
        }
    }, { tableName: 'roles' });
    return role;
};