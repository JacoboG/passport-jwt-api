const { Sequelize } = require('sequelize');
const { makeAssociations } = require('./associations');
const configDb = require('../config/config').database;
const uri = `mysql://${ configDb.host }:${configDb.port}/${configDb.database}`;
const sequelize = new Sequelize(uri, {
    username: configDb.user,
    password: configDb.password,
    define: {
        timestamps: false
    }
});

const modelDefiners = [
    require('./models/Status'),
    require('./models/Role'),
    require('./models/User'),
    require('./models/Token')
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

makeAssociations(sequelize);

sequelize.sync()
    .then(err => {
        console.log('La Conexión ha sido establecida exitosamente.');
    })
    .catch(err => {
        console.error('No se puede conectar a la base de datos:', err);
    });

module.exports = sequelize;