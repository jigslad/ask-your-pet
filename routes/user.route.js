const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiUserController = require('../controller/user.controller');
//Roles
const role = require('./role.route');
const authController = require("../controller/auth.controller");
app.use('/role', role);
module.exports = (function () {
    // User Controller Route using HOST URL + /user
    app.post("/register", apiUserController.registerUser);//addUser
    app.post("/list", ensureAuthorized, apiUserController.listUsers);//viewUser
    app.post("/:id", ensureAuthorized, apiUserController.viewUserById);//viewUser by id
    app.post("/update", ensureAuthorized, apiUserController.updateUser);//updateUser
    app.post("/delete", ensureAuthorized, apiUserController.deleteUser);//deleteUser

    app.post("/login", authController.userLogin);//User login
    app.post("/changePassword", ensureAuthorized, authController.changePassword);
    app.post("/forgotPassword", authController.forgotPassword);
    app.post("/refresh-token", authController.refreshToken);
    app.post("/logout", ensureAuthorized, authController.logout);
    return app;
})();
