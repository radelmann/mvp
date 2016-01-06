$(function() {
    var socket = io();

    window.emitCurrentTrack = function(fileName) {
      socket.emit('current-track', fileName);
    }     
});
