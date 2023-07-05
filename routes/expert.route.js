const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const expertController = require('../controller/expert.controller');
//Export Profiles
const expertProfile = require('./expertProfile.route');
const exportAuthController = require("../controller/expert.auth.controller");
app.use('/expert-profile', expertProfile);
module.exports = (function () {
// User Controller Route using HOST URL + /expert
    app.post("/register", expertController.addExport);//Register Expert
    app.post("/list", ensureAuthorized, expertController.listExports);// View All Exports
    app.post("/:id", ensureAuthorized, expertController.viewExportById);// View Export by Id
    app.post("/update", ensureAuthorized, expertController.updateExport);// Update Expert
    app.post("/delete", ensureAuthorized, expertController.deleteExport);// Delete Expert

    app.post("/allModule", ensureAuthorized, exportAuthController.getAllModule);
    app.post("/getModuleAccess", ensureAuthorized, exportAuthController.getModuleAccess);
    app.post("/resetPassword", exportAuthController.resetPassword); //User Reset Password
    app.post("/login", exportAuthController.exportLogin);//User login
    app.post("/changePassword", ensureAuthorized, exportAuthController.changePassword);
    app.post("/forgotPassword", exportAuthController.forgotPassword);
    app.post("/refresh-token", exportAuthController.refreshToken);
    app.post("/logout", ensureAuthorized, exportAuthController.logout);

    return app;
})();
