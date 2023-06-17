const commonFunctions = require("../helpers/common");
module.exports = {
    checkUserExist: async (UserName) => {
        let query = "select * from user where UserName='" + UserName + "' AND isDeleted = 0";
        let getQuery = await commonFunctions.executeQuery(query);
        return getQuery.data.length > 0;
    },
    addUser: async (BranchId, RoleId, UserProfileId, UserName, Password, currentDate) => {
        let insertData = [BranchId, RoleId, UserProfileId, UserName, Password, currentDate]
        let insertQuery = 'INSERT INTO `user`(`BranchId`,`RoleId`,`UserProfileId`,`UserName`,`Password`,`TimezoneId`) VALUES (?,?,?,?,?,?)';
        return commonFunctions.executeDataQuery(insertQuery, insertData);
    }
}
