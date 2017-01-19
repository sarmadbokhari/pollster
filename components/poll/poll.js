pollster.controller('PollCtrl', ['$scope', '$firebaseObject', 'poll', function($scope, $firebaseObject, poll) {
  $scope.hello = 'Hello world';
  $scope.poll = poll;
  $scope.sortedPollOptions = [];
  $scope.sort = { sortBy: 'voteUps' };
  $scope.addField = { item: '' };

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
      $scope.addField.item = '';
      $scope.sortList($scope.sort.sortBy);
      console.log('saved voteItem successfully');
    });
  };

  $scope.upVote = function upVote(item) {
      if ($scope.userHasUpVoted(item.voteUps)) {
          $scope.removeVote(item.voteUps);
          $scope.removeVote(item.voteDowns);
      } else {
          $scope.removeVote(item.voteUps);
          $scope.removeVote(item.voteDowns);
          $scope.pushVote(item, 'voteUps');
      }
      $scope.poll.options = $scope.sortedPollOptions;
      $scope.poll.$save();
      $scope.sortList($scope.sort.sortBy);
  };

  $scope.downVote = function downVote(item) {
      if ($scope.userHasDownVoted(item.voteDowns)) {
          $scope.removeVote(item.voteUps);
          $scope.removeVote(item.voteDowns);
      } else {
          $scope.removeVote(item.voteUps);
          $scope.removeVote(item.voteDowns);
          $scope.pushVote(item, 'voteDowns');
      }
      $scope.poll.options = $scope.sortedPollOptions;
      $scope.poll.$save();
      $scope.sortList($scope.sort.sortBy);
  };

  $scope.userHasUpVoted = function userHasUpVoted(upVotes) {
      return _.find(upVotes, { name: $scope.localUser });
  };

  $scope.userHasDownVoted = function userHasDownVoted(downVotes) {
      return _.find(downVotes, { name: $scope.localUser });
  };

  $scope.removeVote = function removeVote(vote) {
      var index = _.findIndex(vote, { name: $scope.localUser });
      if (index !== -1) {
          vote.splice(index, 1);
      }
  };

  $scope.itemHasBeenAdded = function itemHasBeenAdded(item) {
      return _.find($scope.poll.options, { name: item });
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

  $scope.addItemEnterPress = function checkEnter(event, item) {
      if (event.keyCode === 13) {
        $scope.addItem(item);
      }
  };

  $scope.addVoterEnterPress = function addVoter(event, creatorName) {
      if (event.keyCode === 13) {
          $scope.enterName(creatorName);
      }
  };

  $scope.sortList = function sortList(sortField) {
      var sortStrategies = {
          'voteUps':    function (option) { return option.voteUps ? option.voteUps.length : 0;      } ,
          'voteDowns':  function (option) { return option.voteDowns ? option.voteDowns.length : 0;  }
      };

      $scope.sortedPollOptions = _.sortBy($scope.poll.options, sortStrategies[sortField]).reverse();
  };

  // Initialization
  $scope.sortList($scope.sort.sortBy);
}]);
