const moment = require("moment");
const {COMMON} = require("../config/global_files");
const utility = require("../helpers/utility");
module.exports = {
    saveAPICall:async (url, payload, status, responce) => {
        try {
            let insertData1 = [moment().utcOffset("+05:30").format(), url, JSON.stringify(payload), status, JSON.stringify(responce)]
            let insertQuery1 = 'INSERT INTO `ExternalAPI`( `time`, `url`, `payload`, `status`, `responce`) VALUES (?,?,?,?,?)';
            return COMMON.executeDataQuery(insertQuery1, insertData1);

        } catch (error) {
            utility.log("save API Call-------",null,'error', error)
            return error
        }
    }
}
