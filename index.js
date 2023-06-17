//Import package
const express = require('express')
const app = express();
const port = 3000;
require('dotenv').config()
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const httpContext = require('express-http-context');
const uuid = require('uuid');
let http = require("http").Server(app);
let io = require("socket.io")(http);

const utility = require('./helpers/utility')
app.use(cors({origin: '*'}));
app.use(cors());

app.use(logger('combined'));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + "/public"));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    httpContext.set('url', req.originalUrl);
    httpContext.set('clientIp', req.headers.host);
    httpContext.set('reqId', uuid.v4());
    httpContext.set('reqTime', Date.now());
    httpContext.set('reqType', req.method);
    httpContext.set('reqHeader', req.headers);
    httpContext.set('reqBody', req.body);
    httpContext.set('reqQuery', req.query);
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Api Version v1

io.on("connection", socket => {
    // Log whenever a user connects
    console.log("user connected");

    // Log whenever a client disconnects from our websocket server
    socket.on("disconnect", function () {
        console.log("user disconnected");
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on("message", message => {
        console.log("Message Received: " + message);
        io.emit("message", {type: "new-message", text: message});
    });
});

const apiV1 = require('./routes');
app.use('/api/v1', apiV1);
/**
 * Allow policy
 */
app.get('*', (req, res) => {
    return res.status(404).send('Resource Not Found!')
});
app.listen(port, () => {
    utility.log(`Example app listening on port ${port}!`)
});
