const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiUserController = require('../controller/user.controller');
module.exports = (function () {
// User Controller Route using HOST URL + /app-config/user
    app.post("/add", ensureAuthorized, apiUserController.addUser);//addUser
    app.post("/list", ensureAuthorized, apiUserController.listUsers);//viewUser
    app.post("/:id", ensureAuthorized, apiUserController.viewUserById);//viewUser by id
    app.post("/update", ensureAuthorized, apiUserController.updateUser);//updateUser
    app.post("/delete", ensureAuthorized, apiUserController.deleteUser);//deleteUser
    return app;
})();
