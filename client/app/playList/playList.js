angular.module('liveStream.playList', [])
  .controller('playListController', function($scope, playList) {
    $scope.data = {};

    playList.getAll().then(function(data) {
      $scope.data.tracks = data;
    });
  });
