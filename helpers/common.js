const path = require("path");

const STATIC = require('../config/static/static');
const con = require(path.dirname(require.main.filename) + '/config/db/db_connection');
const utility = require('./utility')

module.exports = {
    storeErrorLog: (msg, fileName) => {
        const minDate = new Date();
        minDate.setMonth(minDate.getMonth() + 1);
        utility.log(msg);
    },
    executeQuery: async (sqlQuery) => {
        return new Promise((resolve, reject) => {
            con.query(sqlQuery, function (err, result) {
                let data;
                if (err) {
                    data = {status: 0, data: err};
                    reject(data);
                }
                data = {status: 1, data: result};
                resolve(data);
            })
        });
    },
    executeDataQuery: async (sqlQuery, sqlData) => {
        return new Promise((resolve, reject) => {
            con.query(sqlQuery, sqlData, function (err, result) {
                let data;
                if (err) {
                    data = {status: 0, data: err};
                    reject(data);
                } else {
                    data = {status: 1, data: result};
                    resolve(data);
                }
            })
        })
    },
};
