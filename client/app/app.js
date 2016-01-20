angular.module('liveStream', [
    'liveStream.services',
    'liveStream.playList',
    'liveStream.listeningRoom',
    'ngRoute'
  ])
  .config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dj', {
        templateUrl: 'app/playList/playList.html',
        controller: 'playListController'
      })
      .when('/listen', {
        templateUrl: 'app/listeningRoom/listeningRoom.html',
        controller: 'listeningRoomController'
      })
      .otherwise('/dj');
  });
