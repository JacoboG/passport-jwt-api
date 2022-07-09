require('dotenv').config();
const express = require("express");
const morgan = require('morgan');
const path = require("path");
const passport = require("passport");
const { ResponseHandler, NotFoundHandler } = require('./middlewares/ResponseHandler');

// Inicializations
const app = express();

require('./config/passport');
// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({}));
app.use(passport.initialize());

// Public files
app.use(express.static(path.join(__dirname, "/public")));

// Global variables
app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
});
// Configuracion de Rutas
app.use(require("./routes/index.js")); // Configurar ruta principal
app.use("/authentication", require("./routes/authentication.js"));

app.use(ResponseHandler);
app.use(NotFoundHandler);

// Starting server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server on port", port);
});