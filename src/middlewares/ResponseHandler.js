const ResponseTypes = require('../controllers/ResponseTypes');

module.exports = {
    ResponseHandler: (error, req, res, next) => {
        if (error instanceof ResponseTypes.Success)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.Error400)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.Error401)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.Error403)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.Error404)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.Error422)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.Error500)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.SequelizeError)
            res.status(error.code).json(error);
        else if (error instanceof ResponseTypes.JWTError)
            res.status(error.code).json(error);
        else if (error.name == "ValidationError") // Este error vendría de Sequelize
            res.status(200).json(error);
        else if (error.message)
            res.status(500).json(error);
        else
            next();
    },
    NotFoundHandler: (req, res, next) => {
        res.status(404).json(new ResponseTypes.Error404({ msg: 'Endpoint no encontrado.' }));
    }
}