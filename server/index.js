var express = require('express');
var app = express();
module.exports.app = app;

//socket io
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

//socket.io handlers
var numUsers = 0;

io.on('connection', function(socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function(data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function(username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function() {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function() {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function() {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  //send current track to all connected clients
  socket.on('current-track', function(data) {
    console.log('socket current-track ' + data);
    socket.broadcast.emit('current-track', {
      track: data
    });
  });
});

http.listen(app.get("port"));
console.log("Listening on", app.get("port"));
