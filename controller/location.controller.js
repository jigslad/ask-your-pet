const GLOBAL = require('../config/global_files');
const COMMON = GLOBAL.COMMON;


exports.getTimeZone = async (req, res) => {
  
    let query = "select * from  timezone where IsActive=1 and IsDeleted=0";
    let result = await COMMON.executeQuery(query);

    if(result.status === 1){
        if(result.data.length > 0){
            return res.status(200).json({ status: 1, data: result.data, message: '' });
        }else{
            return res.status(200).json({ status: 0, data: [], message: 'Data Not Found.' });
        }
        
    } else {
        return res.status(200).json({ status: 0, data: null, message: 'Something went wrong!!' });
    }
};



exports.getCountry = async (req, res) => {
  
    let query = "select * from countries";
    let result = await COMMON.executeQuery(query);

    if(result.status === 1){
        if(result.data.length > 0){
            return res.status(200).json({ status: 1, data: result.data, message: '' });
        }else{
            return res.status(200).json({ status: 0, data: [], message: 'Data Not Found.' });
        }
        
    } else {
        return res.status(200).json({ status: 0, data: null, message: 'Something went wrong!!' });
    }
};



exports.getState = async (req, res) => {
  
    let query = "select * from states where country_id = "+req.body.country+"";
    let result = await COMMON.executeQuery(query);

    if(result.status === 1){
        if(result.data.length > 0){
            return res.status(200).json({ status: 1, data: result.data, message: '' });
        }else{
            return res.status(200).json({ status: 0, data: [], message: 'Data Not Found.' });
        }
        
    } else {
        return res.status(200).json({ status: 0, data: null, message: 'Something went wrong!!' });
    }
};


exports.getCity = async (req, res) => {
  
    let query = "select * from cities where state_id = "+req.body.state+"";
    let result = await COMMON.executeQuery(query);

    if(result.status === 1){
        if(result.data.length > 0){
            return res.status(200).json({ status: 1, data: result.data, message: '' });
        }else{
            return res.status(200).json({ status: 0, data: [], message: 'Data Not Found.' });
        }
        
    } else {
        return res.status(200).json({ status: 0, data: null, message: 'Something went wrong!!' });
    }
};

exports.changeStatus = async (req,res)=>{

    try{

	let reqData = req.body;
	let updateQuery = "Update "+reqData.updateTable+" SET IsActive='"+reqData.status+"'"
					+" where "+reqData.updateId+"='"+reqData.id+"'";
    
	let result = await COMMON.executeQuery(updateQuery);
		if(result.status === 1){
			if (result.data.affectedRows === 1) {
				return res.status(200).json({status:1,data:result.data,message:'Status Update Successfully'});		
			} else {
				return res.status(200).json({ status: 0, data:null,message:'Status not updated.Try Again!!'});			
			}
		}else{
			return res.status(200).json({ status: 0, data:null,message:'Something Went Wrong!!'});	
		}
	}catch(e){
        GLOBAL.COMMON.storeErrorLog(e + "", __filename.slice(__dirname.length + 1));
	return res.status(200).json({ status: 0, message: GLOBAL.RES_MSG.CATCH_MSG, data: e });
	}	
};
