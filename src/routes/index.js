const express = require("express");
const router = express.Router();
const api = require('./../database');
const ResponseTypes = require('./../controllers/ResponseTypes');

router.get('/', (req, res, next) => {
    const data = {
        message: 'Bienvenido, ¡Hola Mundo!',
    };
    return next(new ResponseTypes.Success({ data }));
});

module.exports = router;