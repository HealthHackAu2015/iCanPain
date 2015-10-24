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

  $scope.$on('$ionicView.enter', function(e) { $scope.initChart(); });

  $scope.initChart = function () {
    $(function () {
        $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

            $('#container').highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'USD to EUR exchange rate over time'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Exchange rate'
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: 'USD to EUR',
                    data: data
                }]
            });
        });
    });
}

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('FirstTimeCtrl', function($scope) {  
  $scope.values = {
    username: window.localStorage.username || "",
    usergender: window.localStorage.usergender || "",
    userage: window.localStorage.userage || "",
    usermedicalcondition: window.localStorage.usermedicalcondition || "",
    userproductiveday: window.localStorage.userproductiveday || "",
  };

  $scope.$on('$ionicView.enter', function(e) {});

  $scope.save = function() {
    window.localStorage.username = $scope.values.username;
    window.localStorage.usergender = $scope.values.usergender;
    window.localStorage.userage = $scope.values.userage;
    window.localStorage.usermedicalcondition = $scope.values.usermedicalcondition;
    window.localStorage.userproductiveday = $scope.values.userproductiveday;

    var data = window.localStorage.data ? JSON.parse(window.localStorage.data) : [];
    data.push([(new Date()).toISOString(), {
      username: $scope.values.username,
      usergender: $scope.values.usergender,
      userage: $scope.values.userage,
      usermedicalcondition: $scope.values.usermedicalcondition,
      userproductiveday: $scope.values.userproductiveday
    }]);

    console.log(data)
    window.localStorage.userdata = JSON.stringify(data);
    $scope.saveButtonText = 'Saved';
    setTimeout(function() {
      $scope.saveButtonText = 'Save';
      $scope.$apply();
    }, 2000);
  };


})
