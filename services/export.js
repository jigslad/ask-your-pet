const commonFunctions = require("../helpers/common");
module.exports = {
    checkExpertExist: async (userId) => {
        let query = "select * from exports where (mobile_no='" + userId + "' OR email_id= '" + userId + "')AND isDeleted = 0";
        let getQuery = await commonFunctions.executeQuery(query);
        return getQuery.data.length > 0;
    },
    addExport: async (EmailId, MobileNo, Password, FirstName, LastName, Language) => {
        let insertData = [EmailId, MobileNo, Password, FirstName, LastName, Language]
        let insertQuery = 'INSERT INTO `exports`(`email_id`,`mobile_no`,`password`,`first_name`,`last_name`,`language`) VALUES (?,?,?,?,?,?)';
        return commonFunctions.executeDataQuery(insertQuery, insertData);
    },
    updateExport: async (EmailId, MobileNo, Password, FirstName, LastName, Language) => {
        let insertData = [EmailId, MobileNo, Password, FirstName, LastName, Language]
        let insertQuery = 'INSERT INTO `exports`(`email_id`,`mobile_no`,`password`,`first_name`,`last_name`,`language`) VALUES (?,?,?,?,?,?)';
        return commonFunctions.executeDataQuery(insertQuery, insertData);
    }
}
