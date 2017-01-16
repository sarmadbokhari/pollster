pollster.controller('PollCtrl', ['$scope', '$firebaseObject', 'poll', function($scope, $firebaseObject, poll) {
  $scope.hello = 'Hello world';
  $scope.poll = poll;

  $scope.enterName = function enterName(name) {
    if(!name) { return; }

    $scope.poll.creatorName = name;
    $scope.poll.newPoll = false;

    $scope.poll.$save().then(function() {
      console.log('saved');
    }, function(err) {
      console.log('error saving poll creator name');
    });
  };

}]);
