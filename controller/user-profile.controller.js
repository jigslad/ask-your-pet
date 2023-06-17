const GLOBAL = require('../config/global_files');
const COMMON = GLOBAL.COMMON;
const RES_MSG = GLOBAL.RES_MSG;
const moment = require('moment');
//MSG 
let msgTitle = 'User Profile';
const ADD_MSG = RES_MSG.ADD_MSG.replace('XX', msgTitle);
const DLT_MSG = RES_MSG.DLT_MSG.replace('XX', msgTitle);
const UPD_MSG = RES_MSG.UPD_MSG.replace('XX', msgTitle);
const ERROR = RES_MSG.ERROR.replace('XX', msgTitle);
const EXIST = RES_MSG.EXIST.replace('XX', msgTitle)
const DATA_LIST = RES_MSG.DATA_LIST.replace('XX', msgTitle)
const TRY_AGAIN = RES_MSG.TRY_AGAIN.replace('XX', msgTitle)


exports.addUserProfile = async (req, res) => {
	try {
        let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const check = "SELECT * FROM userprofile WHERE IsDeleted='0' and RoleId='" + req.body.RoleId + "' and ProfileName='" + req.body.ProfileName + "'";

        let checkData = await COMMON.executeQuery(check);

        if (checkData.status === 1) {

			if (checkData.data.length === 0) {

                let reqData = req.body;
                let arrAccess=reqData.AccessList;
                let UserProfileId;
                let insertData = [reqData.ProfileName,reqData.RoleId,reqData.IsActive]
                let insertQuery = `INSERT INTO userprofile(ProfileName,RoleId,IsActive) VALUES(?,?,?)`;
                let insert = await COMMON.executeDataQuery(insertQuery, insertData);

				if (insert.status === 1) {
                    UserProfileId=insert.data.insertId;
                    let featureInsert;
                    featureInsert="Insert into userprofileaccess(`UserProfileId`,`ModuleId`,`FullAccess`,`InsertAccess`,`UpdateAccess`,`DeleteAccess`,`ViewAccess`,`IsActive`) values";
                    let dt = '';
                    let fa, ia, ua, da, va;
                    for(let i=0; i<arrAccess.length; i++){
						if(arrAccess[i].FullAccess===true){
							fa=1;
						}else{
							fa=0;
						}
						if(arrAccess[i].InsertAccess===true){
							ia=1;
						}else{
							ia=0;
						}
						if(arrAccess[i].UpdateAccess===true){
							ua=1;
						}else{
							ua=0;
						}
						if(arrAccess[i].DeleteAccess===true){
							da=1;
						}else{
							da=0;
						}
						if(arrAccess[i].ViewAccess===true){
							va=1;
						}else{
							va=0;
						}
						let IsActive=1;
						dt=dt+"('"+UserProfileId+"','"+arrAccess[i].ModuleId+"','"+fa+"','"+ia+"','"+ua+"','"+da+"','"+va+"','"+IsActive+"'),";
					}	
					dt = dt.slice(0, -1);
                    featureInsert=featureInsert+""+dt;
                    
                    let checkData = await COMMON.executeQuery(featureInsert);

                    if (checkData.status === 1) {
                        return res.status(200).json({ status: 1, data: null, message: ADD_MSG });
                    }else{
                        return res.status(200).json({ status: 0, data: null, message: ERROR });
                    }

					
				} else {
					return res.status(200).json({ status: 0, data: null, message: ERROR });
				}
        
            } else {
                return res.status(200).json({ status: 0, data: null, message: EXIST });
            }
        } else {
        return res.status(200).json({ status: 0, data: null, message: ERROR });
        }
    } catch (e) {
    GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
    return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
    }
}


exports.viewUserProfile = async (req, res) => {

    try{
        let filter = "";

		if(req.body.filter === "IsActive"){
			filter +=" AND IsActive = "+req.body.filter_value+"";
		}else if(req.body.filter === "role"){
            filter +=" AND RoleId = "+req.body.filter_value+" AND IsActive =1";
        }

        const query = "SELECT * FROM userprofile WHERE IsDeleted='0'" + filter;

        let result = await COMMON.executeQuery(query);
		if (result.status === 1) {
			if (result.data.length > 0) {
				return res.status(200).json({ status: 1, data: result.data, message: DATA_LIST });
			} else {
				return res.status(200).json({ status: 0, data: null, message: RES_MSG.NO_DATA});
			}
		} else {
			return res.status(200).json({ status: 0, data: null, message: ERROR });
		}
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	}
}


exports.updateUserProfile = async (req, res) => {

    try {

        let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        let reqData = req.body;
        let updateData = [reqData.ProfileName, reqData.RoleId, reqData.IsActive, reqData.UserProfileId]
        const updateQuery = "update userprofile set  ProfileName=?,RoleId=?,IsActive=? where UserProfileId=?";
        let deleteData = deleteUserProfileAccess(reqData.UserProfileId, req.UserName);
        let arrAccess = reqData.AccessList;
        let update = await COMMON.executeDataQuery(updateQuery, updateData);
        if (update.status === 1) {
            if (update.data.affectedRows === 1) {
                let UserProfileId = reqData.UserProfileId;
                let featureInsert;
                featureInsert = "Insert into userprofileaccess(`UserProfileId`,`ModuleId`,`FullAccess`,`InsertAccess`,`UpdateAccess`,`DeleteAccess`,`ViewAccess`,`IsActive`) values";
                let fa;
                let ia;
                let ua;
                let da;
                let va;
                let IsActive;
                let dt = '';
                for (let i = 0; i < arrAccess.length; i++) {
                    if (arrAccess[i].FullAccess === true) {
                        fa = 1;
                    } else {
                        fa = 0;
                    }
                    if (arrAccess[i].InsertAccess === true) {
                        ia = 1;
                    } else {
                        ia = 0;
                    }
                    if (arrAccess[i].UpdateAccess === true) {
                        ua = 1;
                    } else {
                        ua = 0;
                    }
                    if (arrAccess[i].DeleteAccess === true) {
                        da = 1;
                    } else {
                        da = 0;
                    }
                    if (arrAccess[i].ViewAccess === true) {
                        va = 1;
                    } else {
                        va = 0;
                    }
                    IsActive = 1;
                    dt = dt + "('" + UserProfileId + "','" + arrAccess[i].ModuleId + "','" + fa + "','" + ia + "','" + ua + "','" + da + "','" + va + "','" + IsActive + "'),";
                }
                dt = dt.slice(0, -1);
                featureInsert = featureInsert + "" + dt;
                let checkData = await COMMON.executeQuery(featureInsert);
                if (checkData.status === 1) {
                    return res.status(200).json({status: 1, data: null, message: UPD_MSG});
                } else {
                    return res.status(200).json({status: 0, data: null, message: ERROR});
                }

            } else {
                return res.status(200).json({status: 0, data: null, message: TRY_AGAIN});
            }
        } else {
            return res.status(200).json({status: 0, data: null, message: ERROR});
        }

    } catch (e) {
        GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
        return res.status(200).json({status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e});
    }
} 

exports.deleteUserProfile = async (req, res) => {
	
 	try{

        let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        let reqData = req.body;
        let updateData = [1,reqData.UserProfileId]
        const updateQuery = "update userprofile set IsDeleted=? where UserProfileId=?";
        let deleteQuery=deleteUserProfileAccess(reqData.UserProfileId,req.UserName); 
        
        let update = await COMMON.executeDataQuery(updateQuery, updateData);
            if (update.status === 1) {
                if (update.data.affectedRows === 1) {
                    return res.status(200).json({ status: 1, data: null, message: DLT_MSG});
                } else {
                    return res.status(200).json({ status: 0, data: null, message: TRY_AGAIN });
                }
            } else {
                return res.status(200).json({ status: 0, data: null, message: ERROR });
            } 

    }catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	} 	

}


exports.getUserProfileById = async (req, res) => { 

    try{

        let getQuery = "select * from userprofile where UserProfileId="+req.body.UserProfileId;
        let result = await COMMON.executeQuery(getQuery);
        let cData = [];
        if (result.status === 1) {
			if (result.data.length > 0) {
                cData.push(result.data);
                let getFQuery = "Select a.ModuleId,Name,`FullAccess`,`InsertAccess`,`UpdateAccess`,`DeleteAccess`,`ViewAccess` from userprofileaccess a " 
                +" LEFT JOIN modules b ON a.ModuleId=b.ModuleId "
                +" where a.IsDeleted=0 and UserProfileId="+req.body.UserProfileId+" and b.IsActive=1 and b.IsDeleted=0";
                let result1 = await COMMON.executeQuery(getFQuery);
                if (result1.status === 1) {
                    if (result1.data.length > 0) {
                        cData.push(result1.data);
                        return res.status(200).json({ status: 1, data:result1.data,profile_data:result.data[0] , message: DATA_LIST })
                    }else{
                        return res.status(200).json({ status: 0, data: null, message: RES_MSG.NO_DATA});
                    }
                }else{
                    return res.status(200).json({ status: 0, data: null, message: ERROR });
                }    
				
			} else {
				return res.status(200).json({ status: 0, data: null, message: RES_MSG.NO_DATA});
			}
		} else {
			return res.status(200).json({ status: 0, data: null, message: ERROR });
		}
        
       
    }catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	} 	
	
} 

async function deleteUserProfileAccess(UserProfileId,UserName){
    const deleteQuery = "DELETE FROM  userprofileaccess where UserProfileId=" + UserProfileId;
    let result1 = await COMMON.executeQuery(deleteQuery);
}
