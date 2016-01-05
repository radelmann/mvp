angular.module('liveStream', [
    'liveStream.services',
    'liveStream.playList',
    'ngRoute'
  ])
  .config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dj', {
        templateUrl: 'app/playList/playList.html',
        controller: 'playListController'
      })
      .otherwise('/dj');
  });
