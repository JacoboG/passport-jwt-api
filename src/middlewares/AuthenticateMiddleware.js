'use strict'
const passport = require('passport');
const ResponseTypes = require('../controllers/ResponseTypes');

let middlewares = {

    /*
    Este middleware va *antes* de las peticiones.
    passport.authenticate de jwt por defecto añade en req.user el objeto que devolvamos desde
    el callback de verificación de la estrategia jwt.
    En nuestro caso hemos personalizado el auth_callback de authenticate y
    aunque también inyectamos ese dato en req.user, aprovechamos y personalizaremos las respuestas
    para que sean tipo json.
    */
    ensureAuthenticated: (req, res, next) => {
        passport.authenticate('jwt.authentication', { session: false }, (err, user, info) => {
            //si hubo un error relacionado con la validez del token (error en su firma, caducado, etc)
            if (info) { return next(new ResponseTypes.JWTError({ msg: info.message })); }
            //si hubo un error en el lado de la estrategia
            if (err) { return next(err); }
            //si el token está firmado correctamente pero no pertenece a un usuario existente
            if (!user) { return next(new ResponseTypes.Error403({ msg: 'No tienes permitido accesar.' })); }
            //inyectamos los datos de usuario en la request
            req.user = user;
            next();
        })(req, res, next);
    },
    ensureRefreshToken: (req, res, next) => {
        passport.authenticate('jwt.refresh-token', { session: false }, (err, user, info) => {
            //si hubo un error relacionado con la validez del token (error en su firma, caducado, etc)
            if (info) { return next(new ResponseTypes.JWTError({ msg: info.message })); }
            //si hubo un error en el lado de la estrategia
            if (err) { return next(err); }
            //si el token está firmado correctamente pero no pertenece a un usuario existente
            if (!user) { return next(new ResponseTypes.Error403({ msg: 'No tienes permitido accesar.' })); }
            //inyectamos los datos de usuario en la request
            req.user = user;
            next();
        })(req, res, next);
    }
}

module.exports = middlewares;