const utility = require('../../helpers/utility')
//- Connection configuration
const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

const mysql_npm = require('mysql');


//-
//- Create the connection variable
//-
let con = mysql_npm.createPool(db_config);


//-
//- Establish a new connection
//-
con.getConnection(function (err) {
    if (err) {
        // mysqlErrorHandling(connection, err);
        utility.log(" *** Cannot establish a connection with the database " + process.env.DB_NAME + " ***");

        con = reconnect(con);
    } else {
        utility.log("*** New connection established with the database " + process.env.DB_NAME + " ***")
    }
});


//-
//- Reconnection function
//-
const reconnect = (con) => {
    utility.log("\n New connection tentative...");

    //- Create a new one
    con = mysql_npm.createPool(db_config);

    //- Try to reconnect
    con.getConnection(function (err) {
        console.log(err)
        if (err) {
            //- Try to connect every 2 seconds.
            return setTimeout(reconnect(con), 2000);
        } else {
            utility.log(" *** New connection established with the database. ***")
            return con;
        }
    });
}


//-
//- Error listener
//-
con.on('error', function (err) {
    utility.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
    return reconnect(con);
});

module.exports = con;
