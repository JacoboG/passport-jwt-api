const api = require('../database');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ResponseTypes = require('./ResponseTypes');
const constants = require('../config/constants');
const { encryptPassword } = require('../helpers/helpers');

let controller = {
    index: async(req, res, next) => {
        let data = {};
        let users = await api.getUsers({
            limit: 2,
            offset: 0,
            id_status: 1,
            except: false,
            search: 'jac',
            order: 'created_at:ASC'
        });
        data = { users };
        return next(new ResponseTypes.Success({ data }));
    },
    /*
    Podríamos haber realizado el registro pasando por el middleware de passport, pero no es necesario,
    en este caso se realiza contra una base de datos asi que es muy sencillo hacerlo nosotros.
    */
    register: async(req, res, next) => {
        const { username, password, fullname, email } = req.body;
        const id_role = constants.ROLE_USER;
        const id_status = constants.STATUS_ACTIVATED;
        const hash = encryptPassword({ password, rounds: parseInt(process.env.BCRYPT_ROUNDS) });
        const newUser = { username, password: hash, fullname, email, id_role, id_status };
        try {
            const userInserted = await api.insertUser({ newUser });
            return next(new ResponseTypes.Success({ data: { userRegistered: userInserted.toJSON() } }));
        } catch (error) {
            return next(new ResponseTypes.SequelizeError({ msg: 'AuthenticateController.register: ' + error.message }));
        }
    },
    login: (req, res, next) => {
        passport.authenticate("local.login", { session: false }, async(err, user) => {
            //si hubo un error en el callback verify relacionado con la consulta de datos de usuario
            if (err || !user) {
                return next(err);
            } else {
                const { id_user } = user;
                // Date.now() está en milisegundos, se necesita en segundos
                const date = Math.floor(Date.now() / 1000);
                const payload_access_token = {
                    sub: id_user,
                    exp: date + parseInt(process.env.JWT_MAX_AGE_ACCESS_TOKEN)
                };
                const payload_refresh_token = {
                    sub: id_user,
                    exp: date + parseInt(process.env.JWT_MAX_AGE_REFRESH_TOKEN)
                };
                /*
                Sólo indicamos el payload ya que el header ya lo crea la librería jsonwebtoken internamente
                para el calculo de la firma y así obtener el token
                */
                const access_token = jwt.sign(JSON.stringify(payload_access_token), process.env.JWT_KEY, { algorithm: process.env.JWT_ALGORITHM });
                const refresh_token = jwt.sign(JSON.stringify(payload_refresh_token), process.env.JWT_KEY, { algorithm: process.env.JWT_ALGORITHM });
                const newToken = { access_token, refresh_token, id_user };
                try {
                    const tokenInserted = await api.insertToken({ newToken });
                    const user = await api.getUserById({ id_user });
                    return next(new ResponseTypes.Success({ data: { userLogged: user.toJSON(), tokens: tokenInserted.toJSON() } }));
                } catch (error) {
                    return next(new ResponseTypes.SequelizeError({ msg: 'AuthenticateController.login: ' + error.message }));
                }
                /*
                NOTA: Si estuviesemos usando sesiones, al usar un callback personalizado, 
                es nuestra responsabilidad crear la sesión.
                Por lo que deberiamos llamar a req.logIn(user, (error)=>{}) aquí
                */
            }
        })(req, res);
    },
    logout: async(req, res, next) => {
        const { sub } = req.jwt_payload;
        const { authorization } = req.headers;
        const old_access_token = authorization.split(' ')[1];
        try {
            const isDelete = await api.deleteTokenByAccessToken({ access_token: old_access_token });
            req.user = null;
            return next(new ResponseTypes.Success({ msg: 'Sesión Cerrada Exitosamente' }));
        } catch (error) {
            return next(new ResponseTypes.SequelizeError({ msg: 'AuthenticateController.refreshToken: ' + error.message }));
        }
    },
    refreshToken: async(req, res, next) => {
        const { id_user } = req.user;
        const { authorization } = req.headers;
        const old_refresh_token = authorization.split(' ')[1];
        // Date.now() está en milisegundos, se necesita en segundos
        const date = Math.floor(Date.now() / 1000);
        const payload_access_token = {
            sub: id_user,
            exp: date + parseInt(process.env.JWT_MAX_AGE_ACCESS_TOKEN)
        };
        const payload_refresh_token = {
            sub: id_user,
            exp: date + parseInt(process.env.JWT_MAX_AGE_REFRESH_TOKEN)
        };
        const access_token = jwt.sign(JSON.stringify(payload_access_token), process.env.JWT_KEY, { algorithm: process.env.JWT_ALGORITHM });
        const refresh_token = jwt.sign(JSON.stringify(payload_refresh_token), process.env.JWT_KEY, { algorithm: process.env.JWT_ALGORITHM });
        const newToken = { access_token, refresh_token, id_user };
        try {
            const tokenInserted = await api.insertToken({ newToken });
            const token = await api.deleteTokenByRefreshToken({ refresh_token: old_refresh_token });
            return next(new ResponseTypes.Success({ data: { tokens: tokenInserted } }));
        } catch (error) {
            return next(new ResponseTypes.SequelizeError({ msg: 'AuthenticateController.refreshToken: ' + error.message }));
        }
    },
    users: async(req, res, next) => {
        const { user, jwt_payload } = req;
        const users = await api.getUsers({});
        const data = { users };
        return next(new ResponseTypes.Success({ data }));
    },
}
module.exports = controller;