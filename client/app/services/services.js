angular.module('liveStream.services', [])

.factory('playList', function($http) {
  // Your code here
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

  return {
    getAll: getAll
  };

});
