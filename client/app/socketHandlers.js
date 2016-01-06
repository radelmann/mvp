$(function() {
  var socket = io();

  window.emitCurrentTrack = function(fileName) {
    socket.emit('current-track', fileName);
  }

  socket.on('user joined', function(data) {
      $('#listeners').text(data.numUsers);
  });

  socket.on('user left', function(data) {
      $('#listeners').text(data.numUsers);
  });
});
