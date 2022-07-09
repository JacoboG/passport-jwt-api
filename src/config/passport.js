const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const api = require("../database");
const constants = require('./constants');
const helpers = require("../helpers/helpers");
const ResponseTypes = require('./../controllers/ResponseTypes');

passport.use(
    'local.login',
    new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            session: false,
            passReqToCallback: true
        },
        async(req, username, password, done) => {
            let user = null;
            try {
                user = await api.getUserByUsername({ username });
            } catch (error) {
                return done(new ResponseTypes.SequelizeError({ msg: 'Passport.login: ' + error.message }));
            }
            if (!user) {
                return done(new ResponseTypes.Error401({ msg: 'El Usuario NO existe.' }), false);
            }
            if (user.id_status !== constants.STATUS_ACTIVATED) {
                return done(new ResponseTypes.Error401({ msg: 'El Usuario ha sido Desactivado.' }), false);
            }
            const validPassword = helpers.matchPassword(password, user.password);
            if (!validPassword) {
                return done(new ResponseTypes.Error401({ msg: 'Contraseña Incorrecta.' }), false);
            }
            return done(null, user);
        })
);

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY,
    algorithms: [process.env.JWT_ALGORITHM],
    ignoreExpiration: false,
    passReqToCallback: true
};

passport.use(
    'jwt.authentication',
    new JwtStrategy(options,
        async(req, jwt_payload, done) => {
            const { sub } = jwt_payload;
            let user = null;
            let userAux = null;
            let { authorization } = req.headers;
            const access_token = authorization.split(' ')[1];
            try {
                user = await api.getUserById({ id_user: sub, id_status: constants.STATUS_ACTIVATED });
                userAux = await api.getUserByAccessToken({ access_token, id_status: constants.STATUS_ACTIVATED });
            } catch (error) {
                return done(new ResponseTypes.SequelizeError({ msg: 'Passport.authentication: ' + error.message }), false);
            }
            if (!user) {
                return done(new ResponseTypes.Error401({ msg: 'El usuario NO existe.' }), false);
            }
            if (!userAux) {
                return done(new ResponseTypes.Error401({ msg: 'El token NO está disponible.' }), false);
            }
            if (user.id_user && userAux.id_user && (user.id_user !== userAux.id_user)) {
                return done(new ResponseTypes.Error400({ msg: 'Inconsistencia de datos.' }), false);
            }
            req.jwt_payload = jwt_payload;
            return done(null, user);
        }
    )
);

passport.use(
    'jwt.refresh-token',
    new JwtStrategy(options,
        async(req, jwt_payload, done) => {
            const { sub } = jwt_payload;
            let user = null;
            let userAux = null;
            const { authorization } = req.headers;
            const refresh_token = authorization.split(' ')[1];
            try {
                user = await api.getUserById({ id_user: sub, id_status: constants.STATUS_ACTIVATED });
                userAux = await api.getUserByRefreshToken({ refresh_token: refresh_token, id_status: constants.STATUS_ACTIVATED });
            } catch (error) {
                return done(new ResponseTypes.SequelizeError({ msg: 'Passport.refreshTwoken: ' + error.message }), false);
            }
            if (!user) {
                return done(new ResponseTypes.Error401({ msg: 'El usuario NO existe.' }), false);
            }
            if (!userAux) {
                return done(new ResponseTypes.Error401({ msg: 'El token NO está disponible.' }), false);
            }
            if (user.id_user && user.id_user && (user.id_user !== userAux.id_user)) {
                return done(new ResponseTypes.Error400({ msg: 'Inconsistencia de datos.' }), false);
            }
            req.jwt_payload = jwt_payload;
            return done(null, user);
        }
    )
);