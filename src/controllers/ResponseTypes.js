// Definiciones de los Tipos de Errores de los Endpoint.

const ResponseTypes = {
    Success: function({ msg = 'OK', data = null }) { // Todo OK, Solo Información
        this.error = false;
        this.code = 200;
        this.message = msg;
        if (data) { this.data = data; }
        return this;
    },
    Error400: function({ msg = 'Bad Request' }) { // Mala Petición
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 400;
        this.name = err.name = "Error400";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    },
    Error401: function({ msg = 'Unauthorized' }) { // No Autorizado
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 401;
        this.name = err.name = "Error401";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    },
    Error403: function({ msg = 'Forbidden' }) { // Prohibido
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 403;
        this.name = err.name = "Error403";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    },
    Error404: function({ msg = 'Not Found' }) { // No Encontrado
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 404;
        this.name = err.name = "Error404";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    },
    Error410: function({ msg = 'Gone' }) { // Ya no disponible
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 410;
        this.name = err.name = "Error410";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    },
    Error422: function({ msg = 'Unprocessable Entity', errors = [] }) { // Error de Validación
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 422;
        this.name = err.name = "Error422";
        this.message = err.message;
        this.errors = errors;
        // this.stack = err.stack;
        return this;
    },
    Error500: function({ msg = 'Internal Server Error' }) { // Error de Servidor
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 500;
        this.name = err.name = "Error500";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    },
    SequelizeError: function({ msg = 'Sequelize Error' }) { // Error de Servidor
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 500;
        this.name = err.name = "SequelizeError";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    },
    JWTError: function({ msg = 'JWT Error' }) { // Error de Servidor
        let err = Error.apply(this, [msg]);
        this.error = true;
        this.code = 401;
        this.name = err.name = "JWTError";
        this.message = err.message;
        // this.stack = err.stack;
        return this;
    }
};

module.exports = ResponseTypes;