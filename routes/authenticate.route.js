const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const authController = require('../controller/auth.controller');

module.exports = (function () {
//Auth Controller  Route using HOST URL + /admin/auth
    app.post("/login", authController.userLogin);//User login
    app.post("/allModule", ensureAuthorized, authController.getAllModule);
    app.post("/getModuleAccess", ensureAuthorized, authController.getModuleAccess);
    app.post("/changePassword", ensureAuthorized, authController.changePassword);
    app.post("/forgotPassword", authController.forgotPassword);
    app.post("/resetPassword", authController.resetPassword); //User Reset Password
    app.post("/refresh-token", authController.refreshToken);
    app.post("/refresh-fcm", ensureAuthorized, authController.refreshFcm);
    app.post("/logout", ensureAuthorized, authController.logout);

    return app;
})();
