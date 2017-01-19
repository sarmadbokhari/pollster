pollster.controller('HomeCtrl', [
  '$scope',
  '$location',
  function ($scope, $location) {
    $scope.loading.poll = false;

    function generateUrl() {
      const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let randomUrl = '';

      for (let i = 0; i < 5; i++) {
        const randomChar = _.random(CHARS.length - 1);
        randomUrl += CHARS[randomChar];
      }

      if (checkDuplicateUrl(randomUrl)) {
        generateUrl();
      } else {
        return randomUrl;
      }
    }

    function checkDuplicateUrl(url) {
      const test = firebase
        .database()
        .ref()
        .child('polls');

      test.once('value', function (snap) {
        return (snap.hasChild(url)) ?
          true :
          false;
      });
    }

    $scope.createPoll = function () {
      $scope.loading.poll = true;

      let url = generateUrl();

      firebase
        .database()
        .ref('polls/' + url)
        .set({
          newPoll: true
        })
        .then(function () {
          $scope.loading.poll = false;
          console.log('url created successfully');
          $location.path('/' + url);
          $scope.$apply();
        })
    };
  }
]);
