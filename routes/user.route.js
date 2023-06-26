const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiUserController = require('../controller/user.controller');
module.exports = (function () {
// User Controller Route using HOST URL + /app-config/user
    app.post("/", ensureAuthorized, apiUserController.addUser);//addUser
    app.get("/", ensureAuthorized, apiUserController.listUsers);//viewUser
    app.get("/:id", ensureAuthorized, apiUserController.viewUserById);//viewUser by id
    app.put("/", ensureAuthorized, apiUserController.updateUser);//updateUser
    app.delete("/", ensureAuthorized, apiUserController.deleteUser);//deleteUser
    return app;
})();
