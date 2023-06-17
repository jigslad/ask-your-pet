const path = require("path");

module.exports = {
    "DEMO": require('./static/static'),
    "PATH": path.dirname(require.main.filename),   
    "STATIC": require(path.dirname(require.main.filename)+'/config/static/static'),   
    "COMMON": require(path.dirname(require.main.filename)+'/helpers/common'),
    "axiosCalls": require(path.dirname(require.main.filename)+'/helpers/axiosCalls'),
    "CON": require(path.dirname(require.main.filename)+'/config/db/db_connection'),   
    "RES_MSG": require(path.dirname(require.main.filename)+'/config/static/api_responce')   
}
