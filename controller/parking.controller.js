const GLOBAL = require('../config/global_files');
const COMMON = GLOBAL.COMMON;
const RES_MSG = GLOBAL.RES_MSG;
const moment = require('moment');
//MSG 
let msgTitle = 'Parking_Immobilize_data';
const ADD_MSG = RES_MSG.ADD_MSG.replace('XX', msgTitle);
const ERROR = RES_MSG.ERROR.replace('XX', msgTitle);
const NOT_EXIST = RES_MSG.NOT_EXIST.replace('XX', msgTitle)
const DATA_LIST = RES_MSG.DATA_LIST.replace('XX', msgTitle)

exports.addParking_immobilizeData = async (req, res) => {//add parking_immobilizaData	
	try {
		let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		let reqData = req.body;
		reqData.UpdatedByUserId = req.UserId
		const query = "SELECT * FROM parking_immobilize_data WHERE VehicleId='" + reqData.VehicleId + "'AND IsDeleted=0";
		let result = await COMMON.executeQuery(query);
	
		let getAllDataFromVehicalId = await getVehicalDatafromVehicalId(reqData.VehicleId)
		if(getAllDataFromVehicalId.length>0)
		{
			let vehicalData = getAllDataFromVehicalId[0]
			reqData = { ...reqData, ...vehicalData}
			if (result.status === 1 && result.data.length <1) {
				let insertData = [reqData.VehicleId, reqData.DeviceId, reqData.ImeiNumber, reqData.Type, cureentDate,cureentDate, reqData.currentstate, reqData.command, reqData.IsActive]
				let insertQuery = "Insert into parking_immobilize_data(VehicleId,DeviceId,ImeiNumber,Type,createddate,updateddate,currentstate,command,IsActive) values(?,?,?,?,?,?,?,?,?)";

				let results = await COMMON.executeDataQuery(insertQuery, insertData);
				await addParking_immobilizeData(reqData)
				if (results.status === 1) {
					return res.status(200).json({ status: 1, data: null, message: ADD_MSG});
				}else {
					return res.status(200).json({ status: 0, data: null, message: ERROR });
				}
			
			} else {
				const {DeviceId, ImeiNumber, Type, currentstate, command, IsActive, VehicleId}= reqData
				let updateData = [DeviceId, ImeiNumber, Type, cureentDate, Number(currentstate), Number(command), IsActive, Number(VehicleId)];
				const updateQuery = "UPDATE parking_immobilize_data SET DeviceId=?,ImeiNumber=?,Type=?,updateddate=?,currentstate=?,command=?,IsActive=? WHERE VehicleId=?";

				let results = await COMMON.executeDataQuery(updateQuery, updateData);

				if (results.status === 1) {
					await addParking_immobilizeData(reqData)
					return res.status(200).json({ status: 1, data: null, message: ADD_MSG});
				} else {
					return res.status(200).json({ status: 0, data: null, message: ERROR });
				}
			}
		} else {
			return res.status(200).json({ status: 0, data: null, message: NOT_EXIST });
		}		
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	}
}

exports.getParking_immobilizeData = async (req, res) => {//get parking_immobilizaData	
	try {
		let reqData = req.body;
		reqData.UpdatedByUserId = req.UserId
		const query = "SELECT * FROM parking_immobilize_data WHERE VehicleId='" + reqData.VehicleId + "'AND IsDeleted=0";
		let result = await COMMON.executeQuery(query);
	
		if (result.status === 1) {
			return res.status(200).json({ status: 1, data: result.data, message: DATA_LIST});
		} else {
			return res.status(200).json({ status: 0, data: null, message: ERROR });
		}
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	}
}

exports.updateParking_immobilizeData = async (req, res) => {//update parking_immobilizaData	
	try {
		const curentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		let reqData = req.body;
		reqData.UpdatedByUserId = req.UserId
		let getAllDataFromVehicalId = await getVehicalDatafromVehicalId(VehicleId)
		if(getAllDataFromVehicalId.length>0)
		{
			let vehicalData = getAllDataFromVehicalId[0]
			reqData = { ...reqData, ...vehicalData}
			const {DeviceId, ImeiNumber, Type, currentstate, command, IsActive, VehicleId}= reqData
			let updateData = [DeviceId, ImeiNumber, Type, curentDate, Number(currentstate), Number(command), IsActive, Number(VehicleId)];
			const updateQuery = "UPDATE parking_immobilize_data SET DeviceId=?,ImeiNumber=?,Type=?,updateddate=?,currentstate=?,command=?,IsActive=? WHERE VehicleId=?";
			let results = await COMMON.executeDataQuery(updateQuery, updateData);
			if (results.status === 1) {
				await addParking_immobilizeData(reqData)
				return res.status(200).json({ status: 1, data: null, message: ADD_MSG});
			} else {
				return res.status(200).json({ status: 0, data: null, message: ERROR });
			}
		} else {
			return res.status(200).json({ status: 0, data: null, message: NOT_EXIST });
		}
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e});
	}
}

exports.getParking_immobilize_history_Data = async (req, res) => {//get parking_immobiliza_history_Data	
	try {
		let reqData = req.body;
		if(reqData.VehicleId)
		{
			// var query = "SELECT pih.* FROM parking_immobilize_history pih WHERE VehicleId='" + reqData.VehicleId + "'AND IsDeleted=0";
			let query = `SELECT pih.id,pih.VehicleId,pih.DeviceId ,pih.ImeiNumber,pih.\`Type\`,pih.Command,pih.UpdatedDate ,u.UserName as UpdatedByUserId,pih.IsActive ,pih.IsDeleted ,pih.command_status  FROM parking_immobilize_history pih LEFT JOIN \`user\` u ON pih.UpdatedByUserId = u.UserId WHERE pih.VehicleId = ${reqData.VehicleId} AND pih.IsDeleted=0 `
			let result = await COMMON.executeQuery(query);
		
			if (result.status === 1) {
				return res.status(200).json({ status: 1, data: result.data, message: DATA_LIST});
			} else {
				return res.status(200).json({ status: 0, data: null, message: ERROR });
			}
		}else {
			return res.status(200).json({ status: 0, data: null, message: ERROR });
		}
	} catch (e) {
		GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
		return res.status(200).json({ status: GLOBAL.RES_MSG.CATCH_CODE, message: GLOBAL.RES_MSG.CATCH_MSG, data: e});
	}
}
async function addParking_immobilizeData(data){//add parking_immobilizaData into History	
	try {
		let cureentDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
		const {VehicleId,DeviceId,ImeiNumber,Type,command,UpdatedByUserId,IsActive} = data
		if(VehicleId && DeviceId && ImeiNumber && Type && command && UpdatedByUserId && IsActive)
		{
			let insertData = [VehicleId,DeviceId,ImeiNumber,Type,command,cureentDate,UpdatedByUserId,IsActive]
			let insertQuery = "Insert into parking_immobilize_history(VehicleId,DeviceId,ImeiNumber,Type,command,updateddate,UpdatedByUserId,IsActive) values(?,?,?,?,?,?,?,?)";
			await COMMON.executeDataQuery(insertQuery, insertData);
		}
		return true

	} catch (e) {
		return e
	}
}

async function getVehicalDatafromVehicalId(VehicleId){//get vehicalData From VehicalId	
	return new Promise(async(resolve, reject) => {
		try {
			if(VehicleId)
			{
				let getData = [VehicleId]
				let getDataquery = "SELECT d.ASimCardNumber As ASimCardNumber,d.ImeiNumber AS ImeiNumber ,d.IsActive AS IsActive,d.DeviceId AS DeviceId,v.VehicleId AS VehicleId FROM device d,vehicledevices v WHERE d.DeviceId = v.DeviceId AND v.VehicleId = ? AND v.IsDeleted = 0";
				let result = await COMMON.executeDataQuery(getDataquery, getData);
				return resolve(result.data)
			}
			else return reject()
		} catch (e) {
			return reject(e)
		}
	})
}
