angular.module('starter.controllers', [])

.controller('GoalsCtrl', function($scope) {  
  $scope.values = {
    pain: window.localStorage.pain || 5,
    productivity: window.localStorage.productivity || 5,
    mood: window.localStorage.mood || 5,
  };
  $scope.saveButtonText = 'Save';

  $scope.$on('$ionicView.enter', function(e) {});

  $scope.save = function() {
    window.localStorage.pain = $scope.values.pain;
    window.localStorage.productivity = $scope.values.productivity;
    window.localStorage.mood = $scope.values.mood;

    var data = window.localStorage.data ? JSON.parse(window.localStorage.data) : [];
    data.push([(new Date()).toISOString(), {
      pain: parseInt($scope.values.pain),
      productivity: parseInt($scope.values.productivity),
      mood: parseInt($scope.values.mood),
    }]);
    window.localStorage.data = JSON.stringify(data);

    $scope.saveButtonText = 'Saved';
    setTimeout(function() {
      $scope.saveButtonText = 'Save';
      $scope.$apply();
    }, 2000);
  };

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

  $scope.initChart = function () {
    $(function () { 
        $('#container').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Fruit Consumption'
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
        });
    });
  };


    $scope.initChart();
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
