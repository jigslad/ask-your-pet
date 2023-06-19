const app = require('express').Router();
const {ensureAuthorized} = require('../middleWare/authCheck');
const exportController = require('../controller/export.controller');
module.exports = (function () {
// User Controller Route using HOST URL + /app-config/user
    app.post("/add", ensureAuthorized, exportController.addExport);//addUser
    app.post("/list", ensureAuthorized, exportController.listExports);//viewUser
    app.post("/:id", ensureAuthorized, exportController.viewExportById);//viewUser
    app.post("/update", ensureAuthorized, exportController.updateExport);//updateUser
    app.post("/delete", ensureAuthorized, exportController.deleteExport);//deleteUser
    return app;
})();
