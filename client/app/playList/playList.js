angular.module('liveStream.playList', [])
  .controller('playListController', function($scope, socket, playList) {
    $scope.data = {};

    playList.getAll().then(function(data) {
      $scope.data.tracks = data;
    });

    $scope.playTrack = function(track) {
      if ($scope.lastSelected) {
        $scope.lastSelected.selected = '';
      }

      this.selected = 'selected';
      $scope.lastSelected = this;

      playList.play(track).then(function(response) {
        //emit socket event with current track
        socket.emit('current-track', track.fileName);
      });
    };

    socket.on('user joined', function(data) {
      $('#listeners').text(data.numUsers);
    });

    socket.on('user left', function(data) {
      $('#listeners').text(data.numUsers);
    });

  });
