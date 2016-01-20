var express = require('express');
var app = express();
module.exports.app = app;

//socket io
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketHandler = require('./sockets.js');

io.on('connection', socketHandler);

//parsing and loggin
var parser = require('body-parser');
var morgan = require('morgan');

//express routes
var router = require('./routes.js')

// port
app.set("port", 3000);

// logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

//static route
app.use(express.static(__dirname + '/../client'));

// api router
var router = require('./routes.js');
app.use("/api", router);

http.listen(app.get("port"));
console.log("Listening on", app.get("port"));
