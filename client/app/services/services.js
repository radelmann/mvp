angular.module('liveStream.services', [])

.factory('playList', function($http) {

  var getAll = function() {
    return $http({
        method: 'GET',
        url: '/api/media'
      })
      .then(function(resp) {
        console.log(resp);
        return resp.data;
      });
  };

  var play = function(track) {
    return $http({
        method: 'POST',
        url: '/api/stream',
        data: JSON.stringify(track)
      })
      .then(function(resp) {
        return resp;
      });
  };

  return {
    getAll: getAll,
    play: play
  };
})

.factory('socket', function ($rootScope) {
  var socket = io.connect();

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
