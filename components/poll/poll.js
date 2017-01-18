pollster.controller('PollCtrl', ['$scope', '$firebaseObject', 'poll', function($scope, $firebaseObject, poll) {
  $scope.hello = 'Hello world';
  $scope.poll = poll;

  var getLocalUser = function getLocalUser() {
    return localStorage.getItem('localUser');
  };

  $scope.checkName = function checkName(name) {
      console.log(name);
  };

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
    if (!item || $scope.itemHasBeenAdded(item)) {
       console.log('Item has been added already');
       return;
    }

    // Add voteItem creator name from localStorage
    var voteItem = {
      creationDate: Date.now(),
      name: item
    };

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
      if ($scope.userHasUpVoted(item.voteUps)) {
          $scope.removeVote(item.voteUps, item.voteDowns);
      } else {
          $scope.removeVote(item.voteUps, item.voteDowns);
          $scope.pushVote(item, 'voteUps');
      }
      $scope.poll.$save();
  };

  $scope.downVote = function downVote(item) {
      if ($scope.userHasDownVoted(item.voteDowns)) {
          $scope.removeVote(item.voteUps, item.voteDowns);
      } else {
          $scope.removeVote(item.voteUps, item.voteDowns);
          $scope.pushVote(item, 'voteDowns');
      }
      $scope.poll.$save();
  };

  $scope.userHasUpVoted = function userHasUpVoted(upVotes) {
    if (upVotes) {
        for (var i = 0; i < upVotes.length; i++) {
            if ($scope.localUser === upVotes[i].name) {
                return true;
            }
        }
    }
    return false;
  };

  $scope.userHasDownVoted = function userHasDownVoted(downVotes) {
    if (downVotes) {
        for (var i = 0; i < downVotes.length; i++) {
            if ($scope.localUser === downVotes[i].name) {
                return true;
            }
        }
    }
    return false;
  };

  $scope.removeVote = function removeVote(votesUps, voteDowns) {
      if (votesUps) {
          var len = votesUps.length;
          while (len--) {
              if ($scope.localUser === votesUps[len].name) {
                  votesUps.splice(len, 1);
              }
          }
      }
      if (voteDowns) {
          len = voteDowns.length;
          while (len--) {
              if ($scope.localUser === voteDowns[len].name) {
                  voteDowns.splice(len, 1);
              }
          }
      }
  };

  $scope.itemHasBeenAdded = function itemHasBeenAdded(item) {
      var options = $scope.poll.options;
      if (item && options) {
          var len = options.length;
          while(len--) {
              if (options[len].name === item) {
                  return true;
              }
          }
      }
      return false;
  };

  $scope.pushVote = function pushVote(item, voteDirection) {
      var vote = {
          name: $scope.localUser,
          date: Date.now()
      };

      if (item[voteDirection]) {
          item[voteDirection].push(vote);
      } else {
          item[voteDirection] = [];
          item[voteDirection].push(vote);
      }
  };

  $scope.checkEnter = function checkEnter(event, item) {
    if (event.keyCode === 13) {
        $scope.addItem(item);
    }
  }

}]);
