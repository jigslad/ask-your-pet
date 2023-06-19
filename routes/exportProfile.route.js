const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const exportProfileController = require('../controller/exportProfile.controller');
module.exports = (function () {
    //Role Controller  Route using HOST URL + /system-config/user-profile
    app.post("/add", ensureAuthorized, exportProfileController.addExportProfile);//addUserProfile
    app.post("/list", ensureAuthorized, exportProfileController.viewExportProfile);//viewUserProfile
    app.post("/update", ensureAuthorized, exportProfileController.updateExportProfile);//updateUserProfile
    app.post("/delete", ensureAuthorized, exportProfileController.deleteExportProfile);//deleteUserProfile
    app.post("/get-profile-by-id", ensureAuthorized, exportProfileController.getExportProfileById);//Get profile by id
    return app;
})();
