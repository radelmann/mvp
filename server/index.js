var express = require('express');
var fs = require('fs');
var path = require('path');

var parser = require('body-parser');
var parser = require('morgan');

var router = require('./routes.js')
var app = express();

//static route
console.log(__dirname + '/../client');

app.use(express.static(__dirname + '/../client'));

// Router
var router = require('./routes.js');
app.use("/api", router);

app.listen(3000);
