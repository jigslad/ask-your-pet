const commonFunctions = require('../helpers/common');
const axios = require('../helpers/axiosCalls');

module.exports = {
    // Repost from db
    getDeviceLogByIMEI: async (req, res, next) => {
        let device = req.params.id ? req.params.id : null;
        if(!device){
            return res.status(401).send({
                "status": 200,
                "message": 'Please Provide IMEI'
            })
        }
        let getDeviceDataQuery = 'SELECT \n' +
            '\td.DeviceId as ID,\n' +
            '\tc.Name as company,\n' +
            '\tb.Name as branch,\n' +
            '\tv.VehicleNumber as vehicleNumber,\n' +
            '\td.ASimCardNumber as simNumber\n' +
            'from \n' +
            '\tdevice d \n' +
            '\tLEFT JOIN branch b on d.BranchId = b.BranchId \n' +
            '\tLEFT JOIN company c on b.CompanyId = c.CompanyId \n' +
            '\tLEFT JOIN vehicledevices vd on d.DeviceId = vd.DeviceId \n' +
            '\tRIGHT JOIN vehicles v on vd.VehicleId = v.VehicleId \n' +
            'WHERE \n' +
            '\td.ImeiNumber = '+ device;
        let deviceDetails = await commonFunctions.executeQuery(getDeviceDataQuery);


        // need to work on report
        // let deviceLastDataQuery = ` SELECT  ImeiNumber as imeiNumber, DataReceiveTime as dataReceiveTime,deviceModel,dataString, deviceDataTime, avaliability, ioPortValues, latitude, latDirection, longitude, lonDirection, speed, power, ignition, odometer from devicedata d WHERE d.ImeiNumber=${device} and DataReceiveTime > 1652722512000 ORDER BY DataReceiveTime DESC LIMIT 1;`
        let deviceLastDataQuery = `SELECT  * from devicedata d WHERE d.ImeiNumber=${device} and DataReceiveTime > 1652722512000 ORDER BY DataReceiveTime DESC LIMIT 1;`
        let deviceLastData = await commonFunctions.executeQuery(deviceLastDataQuery);

        deviceDetails.status = 200;
        deviceDetails.message= "";
        deviceDetails.data[0].deviceLastData = deviceLastData.data[0];
        return res.status(200).send(deviceLastData);
    },
    // report from java
    getDeviceLogById: async (req, res, next) => {
        let device = req.params.id ? req.params.id : null;
        if(!device){
            return res.status(401).send({
                "status": 200,
                "message": 'Please Provide IMEI'
            })
        }
        try {
            delete req.headers.host
            let deviceLogDataFromJava = await axios.call('GET', process.env.JAVA_ENDPOINT + "/api/report/deviceLog/" + device, null, req.headers)
            if(deviceLogDataFromJava['status'] === 200){
                return res.status(200).send(deviceLogDataFromJava.data);
            }
            else {
                return res.status(deviceLogDataFromJava.status).send(deviceLogDataFromJava.data);
            }
        }
        catch (error){
            return res.status(400).send(error.data);
        }


    }
}
