const commonFunction = require('../helpers/common')
module.exports = {
    userActivity: function (ActivityDateTime, UserId, IsDeleted, ActivityDescription) {
        let data;
        try {
            let insertData = [UserId, ActivityDateTime, IsDeleted, ActivityDescription]
            let insertQry = 'Insert into useractivity(`UserId`, `ActivityDateTime`, `IsDeleted`,ActivityDescription) values(?,?,?,?)';
            let userActivity = commonFunction.executeDataQuery(insertQry, insertData)
            return {status: 1, data: userActivity};
        }
        catch (err) {
            return {status: 0, data: err};
        }
    },
}
