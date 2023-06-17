const fs = require("fs");
const jwt = require("jsonwebtoken");
module.exports = {
    //Ensure Authorized function
    ensureAuthorized: async (req, res, next) => {
        const cert = fs.readFileSync(process.cwd() + '/config/public.rsa');
        let bearerToken;
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader === 'undefined') {
            return res.status(401).json({status: 0, data: null, message: 'Unauthorized access!!'});
        }
        const bearer = bearerHeader.split(" ");
        if (!bearer[1]) {
            return res.status(401).json({
                status: 0, data: null, message: 'bearer Token Required Unauthorized access!!'
            });
        }
        try {
            bearerToken = bearer[1]
            let decode = jwt.verify(bearerToken, cert)
            req.token = bearer[1];
            req.UserId = decode.UserId;
            req.LoginRoleId = decode.RoleId;
            req.UserName = decode.UserName;
            req.CompanyId = decode.CompanyId;
            req.BranchId = decode.BranchId;
            req.TimezoneValue = decode.TimezoneValue;
            req.TimezoneName = decode.TimezoneName;
            req.UserProfileId = decode.UserProfileId;
            next();
        } catch (error) {
            if (error.message === 'jwt expired') {
                return res.status(401).json({status: 0, data: null, message: 'Token Expired!'});
            } else {
                return res.status(401).json({status: 0, data: null, message: 'inValid Token'});
            }
        }
    }
}
