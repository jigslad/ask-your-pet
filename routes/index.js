const user = require("./user.route");
const app = require('express').Router();
module.exports = (function () {
    // Authentication routes use prefix /api/v1
    const auth = require('./auth.route');
    app.use('/auth', auth);

    // Users
    const user = require('./user.route');
    app.use('/user', user);

    // Exports
    const exports = require('./export.route');
    app.use('/export', exports);

    //Modules
    const DModule = require('./module.route');
    app.use('/module', DModule);

    //Roles
    const role = require('./role.route');
    app.use('/role', role);

    //Export Profiles
    const exportProfile = require('./exportProfile.route');
    app.use('/exportProfile', exportProfile);

    return app;
})();
