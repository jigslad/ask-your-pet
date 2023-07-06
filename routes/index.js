const app = require('express').Router();
module.exports = (function () {
    //routes use prefix /api/v1
    // Users
    const user = require('./user.route');
    app.use('/user', user);
    // Exports
    const experts = require('./expert.route');
    app.use('/expert', experts);
    //Modules
    const Modules = require('./module.route');
    app.use('/module', Modules);
    return app;
})();
