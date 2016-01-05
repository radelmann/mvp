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
    console.log('ajax play' + track);
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
});
