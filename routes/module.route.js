const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiModuleController = require('../controller/module.controller');
module.exports = (function () {
    //Role Controller  Route using HOST URL + /module
    app.post("/add", ensureAuthorized, apiModuleController.addModule);//addModule
    app.post("/list", ensureAuthorized, apiModuleController.viewModule);//viewModule
    app.post("/update", ensureAuthorized, apiModuleController.updateModule);//updateModule
    app.post("/delete", ensureAuthorized, apiModuleController.deleteModule);//deleteModule
    return app;
})();
