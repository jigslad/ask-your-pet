const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiLocationController = require('../controller/location.controller');
module.exports = (function () {
//Auth Controller  Route using HOST URL + /admin/auth

    app.post("/timezone", ensureAuthorized, apiLocationController.getTimeZone);
    app.post("/country", ensureAuthorized, apiLocationController.getCountry);//User login
    app.post("/state", ensureAuthorized, apiLocationController.getState);
    app.post("/city", ensureAuthorized, apiLocationController.getCity);
    app.post("/change-status", ensureAuthorized, apiLocationController.changeStatus);

    return app;
})();
