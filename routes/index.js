const app = require('express').Router();
module.exports = (function () {
    // Authentication routes use prefix /api/v1
    const auth = require('./auth.route');
    app.use('/auth', auth);

    const location = require('./location.route');
    app.use('/location', location);

    // User
    const user = require('./user.route');
    app.use('/user', user);

    //Module
    const DModule = require('./module.route');
    app.use('/module', DModule);

    //Role
    const role = require('./role.route');
    app.use('/role', role);

    const user_profile = require('./user-profile.route');
    app.use('/user-profile', user_profile);

    return app;
})();
