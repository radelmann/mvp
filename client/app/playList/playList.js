angular.module('liveStream.playList', [])
  .controller('playListController', function($scope, playList) {
    $scope.data = {};

    playList.getAll().then(function(data) {
      $scope.data.tracks = data;
    });

    $scope.playTrack = function(track) {
      playList.play(track).then(function(response) {
        console.log('track playing');
      });
    };

  });
