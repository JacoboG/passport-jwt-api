let controller = {
    unprotected: (req, res) => {
        res.send('OK. Ruta Sin Proteger');
    },
    protected: (req, res) => {
        Number.MAX_SAFE_INTEGER;
        Number.MAX_VALUE;
        res.send(`OK ${req.user.first_name} ${req.user.last_name}, ¡Bienvenido a la ruta protegida!`);
    }
}

module.exports = controller;