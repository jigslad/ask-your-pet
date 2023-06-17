const axios = require('axios').default;
const axiosCall=(method,url,data=null,headers=null)=>{
    let object = {
      method: method,
      url: url
    }
    if(data){
      object.data = data;
    }
    if(headers){
      object.headers = headers;
    }
    return axios(object);
}

module.exports={
    call:axiosCall
}