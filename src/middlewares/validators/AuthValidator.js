const { models } = require('../../database/dbSequelize');
const { body, validationResult } = require('express-validator');
const _ = require('lodash');
const constants = require('../../config/constants');
const helpers = require('../../helpers/helpers');
const ResponseTypes = require('../../controllers/ResponseTypes');

module.exports.registerValidator = [
    body('username').exists().withMessage('Ingresa un Nombre de Usuario.'),
    body('username').isLength({ min: 6, max: 32 }).withMessage('Debe tener entre 6 y 32 caracteres.'),
    body('username').custom(async(value, { req }) => {
        if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)) {
            return;
        }
        const user = await models.user.findOne({ where: { username: value } });
        if (user) {
            throw new Error('Ya existe un usuario con ese nombre de usuario.');
        }
    }),
    body('password').exists().withMessage('Ingresa una Contraseña.'),
    body('password').isLength({ min: 8, max: 60 }).withMessage('Debe tener entre 8 y 60 caracteres.'),
    body('password_confirmed').exists().withMessage('Ingresa una Contraseña.'),
    body('password_confirmed').isLength({ min: 8, max: 60 }).withMessage('Debe tener entre 8 y 60 caracteres.'),
    body('password_confirmed').custom(async(value, { req }) => {
        const password = req.body.password;
        if (value !== password) {
            throw new Error('Las contraseñas NO coinciden.');
        }
    }),
    body('email').exists().withMessage('Ingresa un Correo.'),
    body('email').trim().isEmail().withMessage('Ingresa un Correo válido'),
    body('email').isLength({ min: 8, max: 50 }).withMessage('Debe tener entre 8 y 50 caracteres.'),
    body('email').custom(async(value, { req }) => {
        if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)) {
            return;
        }
        const user = await models.user.findOne({ where: { email: value } });
        if (user) {
            throw new Error('Ya existe un usuario con ese email.');
        }
    }),
    body('fullname').exists().withMessage('Ingresa tu Nombre Completo.'),
    body('fullname').isLength({ min: 10, max: 100 }).withMessage('Debe tener entre 10 y 100 caracteres.'),
    async(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ResponseTypes.Error422({ msg: 'Errores de Validación', errors: errors.array() }));
        }
        next();
    }
];

module.exports.loginValidator = [
    body('username').exists().withMessage('Ingresa un Nombre de Usuario.'),
    body('username').isLength({ min: 6, max: 32 }).withMessage('Debe tener entre 6 y 32 caracteres.'),
    body('password').exists().withMessage('Ingresa una Contraseña.'),
    body('password').isLength({ min: 8, max: 60 }).withMessage('Debe tener entre 8 y 60 caracteres.'),
    async(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ResponseTypes.Error422({ msg: 'Errores de Validación', errors: errors.array() }));
        }
        next();
    }
];