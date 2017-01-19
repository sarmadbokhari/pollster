var pollster = angular.module('pollster', ['ngRoute', 'firebase']);

pollster.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl:  'components/home/home.html',
    controller:   'HomeCtrl'
  }).
  when('/:id', {
    templateUrl:  'components/poll/poll.html',
    controller:   'PollCtrl',
    resolve: {
      'poll': function($route, $firebaseObject) {
        var pollId = $route.current.params.id;
        var ref = firebase.database().ref();

        return $firebaseObject(ref.child('polls').child(pollId)).$loaded();
      }
    }
  }).
  otherwise({
    redirectTo: '/'
  });
}]);

pollster.directive('pollListItems', function() {
    return {
        templateUrl: 'components/poll-list/poll-list.html'
    }
});