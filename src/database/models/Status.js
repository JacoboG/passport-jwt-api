const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const status = sequelize.define('status', {
        id_status: {
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
    }, { tableName: 'statuses' });
    return status;
};