function makeAssociations(sequelize) {
    const { user, status, role, token } = sequelize.models;

    status.hasMany(user, {
        foreignKey: {
            name: 'id_status',
            allowNull: false
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
    });
    user.belongsTo(status, { foreignKey: 'id_status' });

    role.hasMany(user, {
        foreignKey: {
            name: 'id_role',
            allowNull: false
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
    });
    user.belongsTo(role, { foreignKey: 'id_role' });

    user.hasMany(token, {
        foreignKey: {
            name: 'id_user',
            allowNull: false
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    token.belongsTo(user, { foreignKey: 'id_user' });
}

module.exports = { makeAssociations }