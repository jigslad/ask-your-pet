const GLOBAL = require('../config/global_files');
const COMMON = GLOBAL.COMMON;
const RES_MSG = GLOBAL.RES_MSG;
const moment = require('moment');
const userActivityService = require("../services/useractivity");
module.exports = {
    addUser: async (req, res) => {//file upload pending we will implement frontend time
        try {
            const check = "SELECT * FROM user WHERE IsDeleted='0' and UserName='" + req.body.UserName + "'";
            let checkData = await COMMON.executeQuery(check);
            if (checkData.status === 1) {

                if (checkData.data.length === 0) {
                    let reqData = req.body;
                    if (!reqData.ParentCompanyId) {
                        reqData.ParentCompanyId = 0;
                    }
                    let insertData = [reqData.BranchId, reqData.RoleId, reqData.UserProfileId, reqData.FirstName, reqData.LastName, reqData.UserName, reqData.Password, reqData.Email, reqData.Phone, reqData.TimezoneId, reqData.Remarks, reqData.DateFormat, reqData.TimeFormat, reqData.IsActive]
                    let insertQuery = 'INSERT INTO `user`(`BranchId`, `RoleId`, `UserProfileId`, `FirstName`, `LastName`, `UserName`, `Password`, `Email`, `Phone`, `TimezoneId`, `Remarks`, `DateFormat`, `TimeFormat`, `IsActive`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

                    let insert = await COMMON.executeDataQuery(insertQuery, insertData);
                    if (insert.status === 1) {
                        return res.status(200).json({
                            status: 1, data: null, message: GLOBAL.RES_MSG.ADD_MSG.replace('XX', 'User')
                        });
                    } else {
                        return res.status(200).json({
                            status: 0, data: null, message: RES_MSG.ERROR.replace('XX', 'add user')
                        });
                    }

                } else {
                    return res.status(200).json({
                        status: 0, data: null, message: GLOBAL.RES_MSG.EXIST.replace('XX', 'User')
                    });
                }
            } else {
                return res.status(200).json({status: 0, data: null, message: RES_MSG.ERROR.replace('XX', 'add user')});
            }
        } catch (e) {
            GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
            return res.status(200).json({
                status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e
            });
        }
    },
    viewUser: async (req, res) => {
        try {

            let filter = "";
            let reqBody = req.body;
            let childComapny;
            let childBranch;
            if (reqBody.CompanyId != null) {
                childComapny = reqBody.CompanyId;
            } else {
                childComapny = await companyService.getChildCompany(req.CompanyId, req.LoginRoleId);
            }

            if (reqBody.BranchId != null) {
                filter += " and user.BranchId = " + reqBody.BranchId + "";
                childBranch = reqBody.BranchId;
            } else {
                childBranch = await branchService.getChildBranch(childComapny, req.LoginRoleId);
                filter += " and user.BranchId IN (" + childBranch + ")";
            }
            if (req.body.filter) {
                if (req.body.filter === "IsActive") {
                    filter += " and user.IsActive = " + req.body.filter_value + "";
                }
            }
            if (req.params.id) {
                filter += " AND user.UserId =" + req.params.id;
            }

            const query = "SELECT user.* ,company.CompanyId,branch.name as branchName,company.Name as companyName" + " FROM user,company,branch WHERE branch.CompanyId=company.CompanyId" + " and branch.BranchId=user.BranchId and user.IsDeleted=0 " + filter + "  Order By user.UserId Desc";


            let result = await COMMON.executeQuery(query);
            if (result.status === 1) {
                if (result.data.length > 0) {
                    return res.status(200).json({
                        status: 1, data: result.data, message: RES_MSG.DATA_LIST.replace('XX', 'User ')
                    });
                } else {
                    return res.status(200).json({status: 0, data: null, message: RES_MSG.NO_DATA});
                }
            } else {
                return res.status(200).json({status: 0, data: null, message: RES_MSG.CATCH_MSG});
            }
        } catch (e) {

            GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
            return res.status(200).json({
                status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e
            });
        }
    },
    viewUserById: async (req, res) => {
        try {

            let query = "Select UserId,UserName from user where" + " BranchId=" + req.body.BranchId + "" + " and IsDeleted=0 and IsActive=1";

            let result = await COMMON.executeQuery(query);
            if (result.status === 1) {
                if (result.data.length > 0) {
                    return res.status(200).json({
                        status: 1, data: result.data, message: RES_MSG.DATA_LIST.replace('XX', 'User ')
                    });
                } else {
                    return res.status(200).json({status: 0, data: null, message: RES_MSG.NO_DATA});
                }
            } else {
                return res.status(200).json({status: 0, data: null, message: RES_MSG.CATCH_MSG});
            }
        } catch (e) {
            GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
            return res.status(200).json({
                status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e
            });
        }
    },
    updateUser: async (req, res) => {
        try {
            const {
                BranchId,
                RoleId,
                UserProfileId,
                FirstName,
                LastName,
                UserName,
                Password,
                Email,
                Phone,
                TimezoneId,
                DateFormat,
                TimeFormat,
                IsActive,
                UserId
            } = req.body
            const check = "SELECT * FROM user WHERE IsDeleted=0 and UserName ='" + UserName + "' and UserId !=" + UserId + "";
            let checkData = await COMMON.executeQuery(check);
            console.log(checkData);
            if (checkData.status === 1) {

                if (checkData.data.length === 0) {
                    if (BranchId && RoleId && UserProfileId && FirstName && LastName && UserName && Password && Email && Phone && TimezoneId && DateFormat && TimeFormat && IsActive && UserId) {
                        let updateData = [BranchId, RoleId, UserProfileId, FirstName, LastName, UserName, Password, Email, Phone, TimezoneId, DateFormat, TimeFormat, IsActive, UserId]
                        const updateQuery = "update user set BranchId=?,RoleId=?,UserProfileId=?,FirstName=?,LastName=?,UserName=?,Password=?,Email=?,Phone=?,TimezoneId=?,DateFormat=?,TimeFormat=?,IsActive=? where UserId=?";
                        let update = await COMMON.executeDataQuery(updateQuery, updateData);

                        if (update.status === 1) {
                            if (update.data.affectedRows === 1) {
                                return res.status(200).json({
                                    status: 1, data: null, message: 'User Updated Successfully.'
                                });
                            } else {
                                return res.status(200).json({
                                    status: 0, data: null, message: 'Data not updated.Try Again!!'
                                });
                            }
                        } else {
                            return res.status(200).json({status: 0, data: null, message: 'Somthing Went Wrong!'});
                        }
                    } else {
                        return res.status(200).json({
                            status: 0, data: null, message: 'Somthing Went Wrong! for data Missing'
                        });
                    }
                } else {
                    return res.status(200).json({status: 0, data: null, message: 'User Already Exist!'});
                }
            } else {
                return res.status(200).json({status: 0, data: null, message: RES_MSG.NOT_EXIST.replace('XX', 'User')});
            }

        } catch (e) {
            console.log(e)
            GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
            return res.status(200).json({
                status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e
            });
        }

    },
    deleteUser: async (req, res) => {
        try {
            let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            let reqData = req.body;
            let updateData = [1, reqData.UserId]

            const updateQuery = "update user set IsDeleted=? where UserId=?";
            let update = await COMMON.executeDataQuery(updateQuery, updateData);
            await userActivityService.userActivity(req.UserId, cureentDate, 1, "User Deleted");

            if (update.status === 1) {
                if (update.data.affectedRows === 1) {
                    return res.status(200).json({
                        status: 1, data: null, message: RES_MSG.DLT_MSG.replace('XX', 'User')
                    });
                } else {
                    return res.status(200).json({status: 0, data: null, message: RES_MSG.ERROR.replace('XX', 'User')});
                }
            } else {
                return res.status(200).json({status: 0, data: null, message: RES_MSG.ERROR.replace('XX', 'User')});
            }
        } catch (e) {
            GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
            return res.status(200).json({
                status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e
            });
        }
    }
}
