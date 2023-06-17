const GLOBAL = require('../config/global_files');
const COMMON = GLOBAL.COMMON;
const RES_MSG = GLOBAL.RES_MSG;
const moment = require('moment');
//MSG 
let msgTitle = 'Module';
const ADD_MSG = RES_MSG.ADD_MSG.replace('XX', msgTitle);
const DLT_MSG = RES_MSG.DLT_MSG.replace('XX', msgTitle);
const UPD_MSG = RES_MSG.UPD_MSG.replace('XX', msgTitle);
const ERROR = RES_MSG.ERROR.replace('XX', msgTitle);
const EXIST = RES_MSG.EXIST.replace('XX', msgTitle)
const DATA_LIST = RES_MSG.DATA_LIST.replace('XX', msgTitle)
const TRY_AGAIN = RES_MSG.TRY_AGAIN.replace('XX', msgTitle)
exports.addModule = async (req, res) => {
	try {
		let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		const check = "SELECT * FROM modules WHERE IsDeleted='0' and Name	='" + req.body.Name + "' and ParentId ='" + req.body.ParentId + "'";

		let checkData = await COMMON.executeQuery(check);

		if (checkData.status === 1) {

			if (checkData.data.length === 0) {
				let reqData = req.body;
				
				let insertData = [reqData.Name, reqData.PageLink, reqData.Icon, reqData.ParentId, 1, reqData['SortOrder']]
				let insertQuery = `INSERT INTO modules(Name,PageLink,Icon,ParentId,SortOrder,IsActive) VALUES(?,?,?,?,?,?)`;

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
exports.viewModule = async (req, res) => {
	try {
		let filter = "";

		if(req.body.filter === "IsActive"){
			filter +=" AND IsActive = "+req.body.filter_value+"";
		}

		const check = "SELECT md.IsActive,md.ModuleId,md.ParentId,md.Name,md.PageLink,md.Icon,md1.Name AS ParentName"
			+ " FROM modules md"
			+ " LEFT JOIN modules md1 ON md.ParentId = md1.ModuleId"
			+ " WHERE md.IsDeleted='0'" + filter;
		let result = await COMMON.executeQuery(check);

		if (result.status === 1) {
			if (result.data.length > 0) {
				return res.status(200).json({ status: 1, data: result.data, message: DATA_LIST });
			} else {
				return res.status(200).json({ status: 0, data: null, message: RES_MSG.NO_DATA });
			}
		} else {
			return res.status(200).json({ status: 0, data: null, message: ERROR });
		}
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	}
}
exports.updateModule = async (req, res) => {
	try {
		const check = "SELECT * FROM modules WHERE IsDeleted='0' and Name	='" + req.body.Name + "' and ParentId ='" + req.body.ParentId + "' and ModuleId!=" + req.body.ModuleId + "";

		let checkData = await COMMON.executeQuery(check);
		if (checkData.status === 1) {

			if (checkData.data.length === 0) {
				let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
				let reqData = req.body;
				let updateData = [reqData.Name, reqData.PageLink, reqData.Icon, reqData.ParentId, reqData.IsActive, reqData.ModuleId]
				const updateQuery = "update modules set  Name=?,PageLink=?,Icon=?,ParentId=?,IsActive=? where ModuleId =?";

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

exports.deleteModule = async (req, res) => {
	try {

		let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		let reqData = req.body;
		let updateData = [1, reqData.ModuleId]
		const updateQuery = "update modules set IsDeleted=? where ModuleId =?";
		let update = await COMMON.executeDataQuery(updateQuery, updateData);

		if (update.status === 1) {
			if (update.data.affectedRows === 1) {
				return res.status(200).json({ status: 1, data: null, message: DLT_MSG });
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
