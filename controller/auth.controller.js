const GLOBAL = require('../config/global_files');
const COMMON = GLOBAL.COMMON;
const STATIC = GLOBAL.STATIC;

const con = GLOBAL.CON;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const ejs = require("ejs");
const fs = require('fs');
const privateKey = fs.readFileSync(process.cwd() +'/config/private.key');

let transporter = nodemailer.createTransport({
    host: process.env.Gmail_Host, port: process.env.Gmail_Port, secure: process.env.Gmail_Method,
    auth: {user: process.env.Gmail_Username, pass: process.env.Gmail_Password}
});
/*
/*
	status 0 = Incorrect Username and/or Password!
	status 1 = login success 
	status 2 = Please enter Username and Password!'
*/
module.exports = {
    userLogin : async (req, res) => {
        try {
            const {UserName, Password, PlayerId} = req.body;

            if (UserName && Password) {
                const qry = "SELECT u.*,t.TimezoneName,TimezoneValue,b.CompanyId as CompanyId FROM user u "
                    + " LEFT JOIN timezone t ON t.TimezoneId = u.TimezoneId"
                    + " LEFT JOIN branch b ON u.BranchId = b.BranchId"
                    + " WHERE UserName = '" + UserName + "'";

                con.query(qry, async function (error, results, fields) {
                    if (results.length > 0) {
                        if (results[0].Password !== Password) {
                            return res.status(200).json({
                                status: 0,
                                data: null,
                                message: GLOBAL.STATIC.LOGIN.user_pwd_incorrect
                            });
                        }
                        const JWTToken = jwt.sign({
                                UserId: results[0].UserId,
                                FirstName: results[0].FirstName,
                                LastName: results[0].LastName,
                                UserName: results[0].UserName,
                                Email: results[0].Email,
                                UserProfileId: results[0].UserProfileId,
                                RoleId: results[0].RoleId,
                                CompanyId: results[0].CompanyId,
                                BranchId: results[0].BranchId,
                                TimezoneValue: results[0].TimezoneValue,
                                TimezoneName: results[0].TimezoneName
                            },
                            privateKey,
                            {
                                algorithm: 'RS256',
                                expiresIn: '365d'
                            });
                        await savePlayerId(results[0].UserId, PlayerId)
                        return res.status(200).json({
                            status: 1,
                            token: JWTToken,
                            message: 'Login Successfully.'
                        });
                    } else {
                        return res.status(200).json({
                            status: 0,
                            data: null,
                            message: GLOBAL.STATIC.LOGIN.user_pwd_incorrect
                        });
                    }
                });
            } else {

                return res.status(400).json({status: 0, data: null, message: 'Please enter Username and Password!'});
            }
        } catch (error) {
            GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
            return res.status(200).json({
                status: GLOBAL.RES_MSG.CATCH_CODE,
                message: GLOBAL.RES_MSG.CATCH_MSG,
                data: error
            });
        }
    },
    refreshToken : async (req, res) => {
        const Email = req.body.Email;

        if (Email) {
            const qry = "SELECT u.*,t.TimezoneName,TimezoneValue FROM user u "
                + " LEFT JOIN timezone t ON t.TimezoneId = u.TimezoneId"
                + " WHERE Email = '" + Email + "'";

            con.query(qry, function (error, results, fields) {

                if (results.length > 0) {
                    const JWTToken = jwt.sign({
                            UserId: results[0].UserId,
                            FirstName: results[0].FirstName,
                            LastName: results[0].LastName,
                            UserName: results[0].UserName,
                            Email: results[0].Email,
                            UserProfileId: results[0].UserProfileId,
                            RoleId: results[0].RoleId,
                            CompanyId: results[0].CompanyId,
                            BranchId: results[0].BranchId,
                            TimezoneValue: results[0].TimezoneValue,
                            TimezoneName: results[0].TimezoneName
                        },
                        privateKey,
                        {
                            algorithm: 'RS256'
                        });

                    return res.status(200).json({
                        status: 1,
                        token: JWTToken,
                        message: STATIC.TOKEN_REFRESH
                    });
                } else {
                    return res.status(401).json({
                        status: 0,
                        data: null,
                        message: GLOBAL.STATIC.LOGIN.user_pwd_incorrect
                    });
                }
            });
        } else {
            return res.status(404).json({status: 0, data: [], message: STATIC.USER_NOT_EXIST});
        }
    },
    refreshFcm : async (req, res) => {
        let uuid = req.body.uuid;
        let fcm = req.body.fcm;
        if (uuid && fcm) {
            let checkQry = 'select * from fcm_mst where uuid=?';
            let checkQryData = [uuid];
            let checkQryResult = await COMMON.executeDataQuery(checkQry, checkQryData);
            let insUpdQry, msg;
            if (checkQryResult.data.length === 0) {
                insUpdQry = "INSERT INTO `fcm_mst`(`uuid`, `UserId`, `fcm`) VALUES (" + uuid + "," + req.UserId + "," + fcm + ")";
                msg = 'inserted';
            } else {
                insUpdQry = "update fcm_mst set fcm='" + fcm + "' where  uuid = " + checkQryResult.data[0].uuid + " and id = " + checkQryResult.data[0].id + "";
                msg = "updated";
            }

            let fcmQryResult = await COMMON.executeQuery(insUpdQry);
            if (fcmQryResult.status === 0) {
                return res.status(400).json({status: 0, data: [], message: 'Something Went Wrong!!'});
            } else {
                return res.status(200).json({status: 1, data: [], message: 'Token ' + msg + ' successfully'});

            }
        } else {
            return res.status(404).json({status: 0, data: [], message: 'FCM and UUID not exist'});
        }


    },
    logout : async (req, res) => {
        let uuid = req.body.uuid;
        if (uuid) {
            let checkQry = 'select * from fcm_mst where uuid=?';
            let checkQryData = [uuid];
            let checkQryResult = await COMMON.executeDataQuery(checkQry, checkQryData);
            if (checkQryResult.data.length === 0) {
                return res.status(400).json({status: 1, data: [], message: STATIC.USER_NOT_EXIST});

            } else {
                const insUpdQry = "update fcm_mst set fcm='' where  uuid = " + checkQryResult.data[0].uuid + " and id = " + checkQryResult.data[0].id + "";
                let fcmQryResult = await COMMON.executeQuery(insUpdQry);
                return res.status(200).json({status: 1, data: [], message: 'Logout successfully'});
            }

        } else {
            return res.status(404).json({status: 1, data: [], message: 'UUID not exist'});
        }
    },
    getAllModule : async (req, res) => {
        try {
            let reqData = req.body;
            let query = "SELECT `ModuleId` AS id,`Name`AS title,`PageLink` AS url,`Icon` AS icon,`ParentId`,IsActive"
                + " FROM `modules` WHERE `IsDeleted`=0 and `IsActive`=1 and"
                + " `ModuleId` IN (Select `ModuleId` from `userprofileaccess`"
                + " where `IsDeleted`=0  and `UserProfileId` = " + req.UserProfileId
                + "  and (`FullAccess`=1 OR `InsertAccess`=1 OR `UpdateAccess`=1 OR `DeleteAccess`=1 OR `ViewAccess`=1 )) ORDER BY `SortOrder` ASC";
            let result = await COMMON.executeQuery(query);
            if (result.status === 1) {
                if (result.data.length > 0) {
                    return res.status(200).json({status: 1, data: result.data, message: 'Success'});
                } else {
                    return res.status(200).json({status: 0, data: null, message: 'Data Not Found'});
                }
            } else {
                return res.status(200).json({status: 0, data: null, message: 'Something Went Wrong!!'});
            }
        } catch (e) {
            return res.status(200).json({status: 0, data: e, message: 'Something Went Wrong!!'});
        }
    },
    getModuleAccess : async (req, res) => {

        let Full = false;
        let Insert = false;
        let Update = false;
        let Delete = false;
        let View = false;
        let query = "select b.* from modules a,userprofileaccess b where"
            + " a.ModuleId=b.ModuleId and UserProfileId='" + req.UserProfileId + "'"
            + " and PageLink='" + req.body.PageLink + "'";
        con.query(query, function (error, results, fields) {

            if (error) {
                console.log(error);
            } else {

                let resultsData = {
                    FullAccess: Full,
                    InsertAccess: Insert,
                    UpdateAccess: Update,
                    DeleteAccess: Delete,
                    ViewAccess: View
                };
                if (results.length !== 0) {
                    let rData = results[0] !== 0;
                    Full = rData.FullAccess !== 0;
                    Insert = rData.InsertAccess !== 0;
                    Update = rData.UpdateAccess !== 0;
                    Delete = rData.DeleteAccess !== 0;
                    View = rData.ViewAccess !== 0;
                    resultsData = {
                        FullAccess: Full,
                        InsertAccess: Insert,
                        UpdateAccess: Update,
                        DeleteAccess: Delete,
                        ViewAccess: View
                    };
                }
                return res.status(200).json({status: 1, data: resultsData, message: 'Success'});
            }
        });
    },
    forgotPassword : async (req, res) => {
        const {Email} = req.body;
        const qry = "SELECT u.*,t.TimezoneName,TimezoneValue FROM user u "
            + " LEFT JOIN timezone t ON t.TimezoneId = u.TimezoneId"
            + " WHERE Email = '" + Email + "'";
        con.query(qry, async function (error, results, fields) {

            if (results.length > 0) {
                const new_password = Math.random().toString(36).slice(2);

                const data = await ejs.renderFile(__dirname + "./../../../../email/forgot.ejs", {
                    name: results[0].UserName,
                    email: Email,
                    Password: new_password
                });
                let mailOptions = {
                    from: process.env.Gmail_Username,
                    to: Email,
                    subject: "Forgot Password - InOrBitFleet",
                    html: data
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return res.status(200).json({
                            status: 0,
                            data: null,
                            message: 'Mail Not send Please Try Again' + err
                        });

                    } else {
                        const qry = "update user set Password='" + new_password + "' WHERE Email='" + Email + "'";
                        con.query(qry, function (error, results, fields) {
                            return res.status(200).json({
                                status: 1,
                                data: null,
                                message: 'Please check your Mail we have send new password !!'
                            });
                        });
                    }
                });
            } else {
                return res.status(200).json({status: 0, data: null, message: 'Your Email id is not exits !'});

            }
        });
    },
    changePassword : async (req, res) => {

        const query = "SELECT u.*,t.TimezoneName,TimezoneValue FROM user u "
            + " LEFT JOIN timezone t ON t.TimezoneId = u.TimezoneId"
            + " WHERE UserId = '" + req.UserId + "' and Password='" + req.body.current_password + "'";

        let result = await COMMON.executeQuery(query);
        if (result.status === 1) {
            if (result.data.length > 0) {
                const updateQuery = "update user set Password='" + req.body.new_password + "' WHERE UserId = '" + req.UserId + "'";
                let updateResult = await COMMON.executeQuery(updateQuery);
                if (updateResult.status === 1) {
                    if (updateResult.data.affectedRows) {
                        return res.status(200).json({
                            status: 1,
                            data: result.data,
                            message: 'Password Change successfully.'
                        });
                    } else {
                        return res.status(200).json({status: 0, data: null, message: 'Something went wrong!!'});
                    }
                } else {
                    return res.status(200).json({status: 0, data: null, message: 'Something went wrong!!'});
                }
            } else {
                return res.status(200).json({status: 0, data: null, message: 'Old Password not match'});
            }
        } else {
            return res.status(200).json({status: 0, data: null, message: 'Something went wrong!!'});
        }
    },
    resetPassword : async (req, res) => {
        const {UserName, Password, newPassword} = req.body;
        if (UserName && Password && newPassword) {
            const qry = "SELECT u.*,t.TimezoneName,TimezoneValue FROM user u "
                + " LEFT JOIN timezone t ON t.TimezoneId = u.TimezoneId"
                + " WHERE UserName = '" + UserName + "' AND Password = '" + Password + "'";

            con.query(qry, async function (error, results, fields) {
                if (results.length > 0) {
                    const updateQuery = "update user set Password='" + newPassword + "' WHERE UserName = '" + UserName + "'";
                    let updateResult = await COMMON.executeQuery(updateQuery);
                    if (updateResult.status === 1) {
                        if (updateResult.data.affectedRows) {
                            return res.status(200).json({
                                status: 1,
                                data: result.data,
                                message: 'Password Change successfully.'
                            });
                        } else {
                            return res.status(200).json({status: 0, data: null, message: 'Something went wrong!!'});
                        }
                    } else {
                        return res.status(200).json({status: 0, data: null, message: 'Something went wrong!!'});
                    }
                } else {
                    return res.status(401).json({
                        status: 0,
                        data: null,
                        message: GLOBAL.STATIC.LOGIN.user_oldpwd_incorrect
                    });
                }
            });
        } else {
            return res.status(401).json({status: 0, data: null, message: 'Please enter Username and Passwords!'});
        }
    },
}
async function savePlayerId(UserId, PlayerId) {
    if (UserId && PlayerId) {
        let qry = "SELECT * FROM user_playerids WHERE UserId = '" + UserId + "' AND IsDeleted = 0";
        await con.query(qry, async function (error, results, fields) {
            if (results.length > 0) {
                const qry = "UPDATE user_playerids SET PlayerId='" + PlayerId + "' WHERE UserId='" + UserId + "'AND IsDeleted = 0";
                await con.query(qry, function (error, results, fields) {

                });
            } else {
                let insUpdQry = "INSERT INTO `user_playerids`(`UserId`,`PlayerId`,`IsActive` ,`IsDeleted`) VALUES (" + UserId + ",'" + PlayerId + "',1,0)";
                let update = await COMMON.executeQuery(insUpdQry);
            }
        });
    }
}
