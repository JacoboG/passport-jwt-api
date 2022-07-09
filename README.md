# Passport JWT API
Boilerplate to init a web application with passport-jwt library.

## Init Project
```bash
git clone https://github.com/JacoboG/passport-jwt-api.git

cd passport-jwt-api

npm install
```
## Run Project
```bash
npm run dev
```

**IMPORTANT:** Add **.env** file to root directory before to run project.

## File Example .env
```bash
# SERVER OPTIONS
NODE_ENV=development
HOST=127.0.0.1
PORT=5000
# DATABASE OPTIONS
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=<database_name>
DB_USER=<database_user>
DB_PASSWORD=<database_password>
# JWT OPTIONS
JWT_KEY=<jwt_password_key>
JWT_MAX_AGE_ACCESS_TOKEN=<jwt_ac_time_in_minutes>
JWT_MAX_AGE_REFRESH_TOKEN=<jwt_rt_time_in_minutes>
JWT_ALGORITHM=HS256
# BCRYPT OPTIONS
BCRYPT_ROUNDS=16
```

## Routes
```node
router.post('/register', registerValidator, AuthenticationController.register);

router.post('/login', loginValidator, AuthenticationController.login);

router.post('/refresh-token', ensureRefreshToken, AuthenticationController.refreshToken);

router.post('/logout', ensureAuthenticated, AuthenticationController.logout);
```

## Middlewares
```node
const AuthenticateMiddleware = {
    ensureAuthenticated: async(req, res, next);
    ensureRefreshToken: async(req, res, next);
}
```

## Validators
The validators was implented with `express-validator`
```node
const AuthValidator = {
    registerValidator: async(req, res, next);
    loginValidator: async(req, res, next);
}
```

## Models
The database connection was implented with `sequelize`
- Role
- Status
- Token
- User

## API's
- ApiHelpers
- ApiRoles
- ApiStatuses
- ApiTokens
- ApiUsers

## Response Handlers
```node
const ResponseHandler = {
    ResponseHandler: (error, req, res, next),
    NotFoundHandler: (req, res, next)
}
```

## Response Types
```node
const ResponseTypes = {
    Success: function({ msg = 'OK', data = null }),
    Error400: function({ msg = 'Bad Request' }),
    Error401: function({ msg = 'Unauthorized' }),
    Error403: function({ msg = 'Forbidden' }),
    Error404: function({ msg = 'Not Found' }),
    Error410: function({ msg = 'Gone' }),
    Error422: function({ msg = 'Unprocessable Entity', errors = [] }),
    Error500: function({ msg = 'Internal Server Error' }),
    SequelizeError: function({ msg = 'Sequelize Error' }),
    JWTError: function({ msg = 'JWT Error' })
};
```