const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const authController = require('../controller/auth.controller');
const exportAuthController = require('../controller/export.auth.controller');

module.exports = (function () {
//Auth Controller  Route using HOST URL + /admin/auth
    app.post("/user/login", authController.userLogin);//User login
    app.post("/user/changePassword", ensureAuthorized, authController.changePassword);
    app.post("/user/forgotPassword", authController.forgotPassword);
    app.post("/user/refresh-token", authController.refreshToken);
    app.post("/user/logout", ensureAuthorized, authController.logout);


    app.post("/export/allModule", ensureAuthorized, exportAuthController.getAllModule);
    app.post("/export/getModuleAccess", ensureAuthorized, exportAuthController.getModuleAccess);
    app.post("/export/resetPassword", exportAuthController.resetPassword); //User Reset Password
    app.post("/export/login", exportAuthController.exportLogin);//User login
    app.post("/export/changePassword", ensureAuthorized, exportAuthController.changePassword);
    app.post("/export/forgotPassword", exportAuthController.forgotPassword);
    app.post("/export/refresh-token", exportAuthController.refreshToken);
    app.post("/export/logout", ensureAuthorized, exportAuthController.logout);

    return app;
})();
