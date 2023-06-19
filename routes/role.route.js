const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiRoleController = require('../controller/role.controller');

module.exports = (function () {
    //Role Controller  Route using HOST URL + /system-config/role
    app.post("/add", ensureAuthorized, apiRoleController.addRole);//addRole
    app.post("/list", ensureAuthorized, apiRoleController.viewRole);//viewRole
    app.post("/update", ensureAuthorized, apiRoleController.updateRole);//updateRole
    app.post("/delete", ensureAuthorized, apiRoleController.deleteRole);//deleteRole
    return app;
})();
