pollster.controller('PollCtrl', ['$scope', '$firebaseObject', 'poll', function($scope, $firebaseObject, poll) {
  $scope.hello = 'Hello world';
  $scope.poll = poll;

  var getLocalUser = function getLocalUser() {
    return localStorage.getItem('localUser');
  }

  $scope.localUser = getLocalUser();

  $scope.enterName = function enterName(name) {
    if(!name) { return; }

    localStorage.setItem('localUser', name);
    $scope.localUser = getLocalUser();
    $scope.poll.creatorName = name;
    $scope.poll.newPoll = false;

    $scope.poll.$save().then(function() {
      console.log('saved');
    }, function(err) {
      console.log('error saving poll creator name');
    });
  };

  $scope.addItem = function(item) {
    // Add voteItem creator name from localStorage
    var voteItem = {
      creationDate: Date.now(),
      name: item
    }

    if ($scope.poll.options) {
      $scope.poll.options.push(voteItem);
    } else {
      $scope.poll.options = [];
      $scope.poll.options.push(voteItem);
    }

    $scope.poll.$save().then(function() {
      $scope.item = '';
      console.log('saved voteItem successfully');
    });

  };

  $scope.upVote = function upVote(item) {
    var voteUp = {
      name: $scope.localUser,
      date: Date.now()
    }
    
    if (item.voteUps) {
      item.voteUps.push(voteUp);
    } else {
      item.voteUps = [];
      item.voteUps.push(voteUp);
    }
    $scope.poll.$save();
  };

  $scope.downVote = function downVote(item) {
    var voteDown = {
      name: $scope.localUser,
      date: Date.now()
    }

    if (item.voteDowns) {
      item.voteDowns.push(voteDown);
    } else {
      item.voteDowns = [];
      item.voteDowns.push(voteDown);
    }
    $scope.poll.$save();
  };

  $scope.userHasUpVoted = function userHasUpVoted(upVotes) {
    for (var i = 0; i < upVotes.length; i++) {
      if ($scope.localUser === upVotes[i].name) {
        return true;
      }
    }
    return false;
  };

  $scope.userHasDownVoted = function userHasDownVoted(downVotes) {
    for (var i = 0; i < downVotes.length; i++) {
      if ($scope.localUser === downVotes[i].name) {
        return true;
      }
    }
    return false;
  };

}]);
