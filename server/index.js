var express = require('express');
var parser = require('body-parser');
var morgan = require('morgan');


var router = require('./routes.js')
var app = express();
module.exports.app = app;

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


// if we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}
