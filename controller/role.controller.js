const GLOBAL = require('../config/global_files');
const COMMON = GLOBAL.COMMON;
const RES_MSG = GLOBAL.RES_MSG;
const moment = require('moment');
//MSG 
let msgTitle = 'Role';
const ADD_MSG = RES_MSG.ADD_MSG.replace('XX', msgTitle);
const DLT_MSG = RES_MSG.DLT_MSG.replace('XX', msgTitle);
const UPD_MSG = RES_MSG.UPD_MSG.replace('XX', msgTitle);
const ERROR = RES_MSG.ERROR.replace('XX', msgTitle);
const EXIST = RES_MSG.EXIST.replace('XX', msgTitle)
const DATA_LIST = RES_MSG.DATA_LIST.replace('XX', msgTitle)
const TRY_AGAIN = RES_MSG.TRY_AGAIN.replace('XX', msgTitle)
const SUPER_ADMIN_ROLE = GLOBAL.STATIC.SUPER_ADMIN_ROLE;

exports.addRole = async (req, res) => {
	try {
		let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		const check = "SELECT * FROM role WHERE IsDeleted='0' and RoleName='" + req.body.RoleName + "'";

		let checkData = await COMMON.executeQuery(check);

		if (checkData.status === 1) {

			if (checkData.data.length === 0) {
				let reqData = req.body;
				let insertData = [reqData.RoleName, reqData.IsActive]
				let insertQuery = `INSERT INTO role(RoleName,IsActive) VALUES(?,?)`;

				let insert = await COMMON.executeDataQuery(insertQuery, insertData);

				if (insert.status === 1) {
					return res.status(200).json({ status: 1, data: null, message: ADD_MSG });
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
exports.viewRole = async (req, res) => {

	try {
		let filter = "";

		if (req.body.filter === "IsActive") {
			filter += " AND IsActive = " + req.body.filter_value + "";
		}
		if (req.LoginRoleId !== SUPER_ADMIN_ROLE) {
			filter += " AND RoleId > " + (req.LoginRoleId);
		}
		const query = "SELECT * FROM role WHERE IsDeleted='0'" + filter;
		let result = await COMMON.executeQuery(query);
		if (result.status === 1) {
			if (result.data.length > 0) {
				return res.status(200).json({status: 1, data: result.data, message: DATA_LIST});
			} else {
				return res.status(200).json({status: 0, data: null, message: RES_MSG.NO_DATA});
			}
		} else {
			return res.status(200).json({status: 0, data: null, message: ERROR});
		}
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	}
}
exports.updateRole = async (req, res) => {

	try {
		let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		const check = "SELECT * FROM role WHERE IsDeleted='0' and RoleName='" + req.body.RoleName + "' and RoleId!=" + req.body.RoleId + "";

		let checkData = await COMMON.executeQuery(check);

		if (checkData.status === 1) {

			if (checkData.data.length === 0) {
				let reqData = req.body;
				let updateData = [reqData.RoleName, reqData.IsActive, reqData.RoleId]
				const updateQuery = "update role set  RoleName=?,IsActive=? where RoleId=?";

				let update = await COMMON.executeDataQuery(updateQuery, updateData);
				if (update.status === 1) {
					if (update.data.affectedRows === 1) {
						return res.status(200).json({ status: 1, data: null, message: UPD_MSG });
					} else {
						return res.status(200).json({ status: 0, data: null, message: TRY_AGAIN });
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
exports.deleteRole = async (req, res) => {
	try {
		let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		let reqData = req.body;
		let updateData = [1,  reqData.RoleId]
		const updateQuery = "update role set IsDeleted=? where RoleId=?";
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
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	}
}
exports.accesslist = async (req, res) => {
	try {
		const query = "Select * from modules where IsDeleted=0 and IsActive=1 ORDER BY ModuleId,ParentId";

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
