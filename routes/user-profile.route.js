const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const apiUserProfileController = require('../controller/user-profile.controller');
module.exports = (function () {
    //Role Controller  Route using HOST URL + /system-config/user-profile
    app.post("/add", ensureAuthorized, apiUserProfileController.addUserProfile);//addUserProfile
    app.post("/view", ensureAuthorized, apiUserProfileController.viewUserProfile);//viewUserProfile
    app.post("/update", ensureAuthorized, apiUserProfileController.updateUserProfile);//updateUserProfile
    app.post("/delete", ensureAuthorized, apiUserProfileController.deleteUserProfile);//deleteUserProfile
    app.post("/get-profile-by-id", ensureAuthorized, apiUserProfileController.getUserProfileById);//Get profile by id
    return app;
})();
