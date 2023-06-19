const commonFunction = require('../helpers/common')
module.exports = {
    exportActivity: function (ActivityDateTime, ExportId, IsDeleted, ActivityDescription) {
        let data;
        try {
            let insertData = [ExportId, ActivityDateTime, IsDeleted, ActivityDescription]
            let insertQry = 'Insert into export_activity(`ExportId`, `ActivityDateTime`, `IsDeleted`,ActivityDescription) values(?,?,?,?)';
            let userActivity = commonFunction.executeDataQuery(insertQry, insertData)
            return {status: 1, data: userActivity};
        } catch (err) {
            return {status: 0, data: err};
        }
    },
}
