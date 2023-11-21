function addTriggers(sequelize) {
    const { user, status, role, token } = sequelize.models;

    sequelize.query(`DROP TRIGGER IF EXISTS USERS_DELETE_TOKEN_ON_DEACTIVATED;`);
    sequelize.query(`
    CREATE TRIGGER IF NOT EXISTS USERS_DELETE_TOKEN_ON_DEACTIVATED
        AFTER UPDATE ON users
        FOR EACH ROW
            IF (OLD.id_status = 1 AND NEW.id_status = 2) OR (OLD.id_status = 1 AND NEW.id_status = 3) 
            OR (OLD.id_status = 2 AND NEW.id_status = 3)
            OR (OLD.id_status = 3 AND NEW.id_status = 2)
            THEN 
                DELETE FROM tokens WHERE tokens.id_user = OLD.id_user;
            END IF
    `);
    user.afterUpdate(instance => {
        const oldValues = instance._previousDataValues;
        const newValues = instance.dataValues;
        if ((oldValues.id_status == 1 && (newValues.id_status == 2 || newValues.id_status == 3))
        || (oldValues.id_status == 2 && newValues.id_status == 3)
        || (oldValues.id_status == 3 && newValues.id_status == 2)) {
            token.destroy({
                where: {
                    id_user: newValues.id_user
                },
            });
        }
    });
}

module.exports = { addTriggers }