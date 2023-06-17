const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiUserController = require('../controller/user.controller');
module.exports = (function () {
// User Controller Route using HOST URL + /app-config/user
    app.post("/add", ensureAuthorized, apiUserController.addUser);//addUser
    app.post("/view", ensureAuthorized, apiUserController.viewUser);//viewUser
    app.post("/view/:id", ensureAuthorized, apiUserController.viewUser);//viewUser
    app.post("/update", ensureAuthorized, apiUserController.updateUser);//updateUser
    app.post("/delete", ensureAuthorized, apiUserController.deleteUser);//deleteUser
    app.post("/view-by-company-branch", ensureAuthorized, apiUserController.viewUserById);
    return app;
})();
