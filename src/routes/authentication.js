const express = require("express");
const router = express.Router();
const AuthenticationController = require('./../controllers/AuthenticateController');
const { ensureAuthenticated, ensureRefreshToken, ensureSuperadmin } = require('./../middlewares/AuthenticateMiddleware');
const { registerValidator, loginValidator } = require('../middlewares/validators/AuthValidator');

router.get('/', AuthenticationController.index);
router.post('/register', registerValidator, AuthenticationController.register);
router.post('/login', loginValidator, AuthenticationController.login);
router.post('/refresh-token', ensureRefreshToken, AuthenticationController.refreshToken);
router.post('/logout', ensureAuthenticated, AuthenticationController.logout);
router.post('/users', ensureAuthenticated, AuthenticationController.users);

module.exports = router;