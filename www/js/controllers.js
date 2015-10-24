angular.module('starter.controllers', [])

.controller('GoalsCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.$on('$ionicView.enter', function(e) { $scope.initChart(); });

  $scope.getData = function() {
    var data = window.localStorage.data ? JSON.parse(window.localStorage.data) : [];
    return data;
  };

  $scope.buildSeries = function() {
    var data = window.localStorage.data ? JSON.parse(window.localStorage.data) : [];

    var series = {};
    series.mood = [];
    series.pain = [];

    for (var i = 0; i < data.length; i++)
    {
        series.mood.push([data[i].Date, parseInt(data[i].Mood)]);
        series.pain.push([data[i].Date, parseInt(data[i].Pain)]);
    }

    return series;
  }

  $scope.initChart = function () {
    $(function () {
        var series = $scope.buildSeries();

        $('#container').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Pain Impact over Time'
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
                    text: 'Pain Impact'
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
                type: 'line',
                name: 'Mood',
                data: series.mood
            },
            {
                type: 'line',
                name: 'Pain',
                data: series.pain
            }]
        });
    });
}

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {})

.controller('QuestionsCtrl', function($scope) {
	$scope.$on('$ionicView.enter', function (e) {
		var vertRanges = document.getElementsByClassName("range-vertical");
		for (var i = 0; i < vertRanges.length; ++i) {
			var slider = vertRanges[i];
			slider.style.width = slider.parentElement.clientHeight + "px";
			slider.style.height = slider.parentElement.clientHeight + "px";
			slider.style["margin-left"] = (-slider.parentElement.clientHeight / 2) + "px";
			//slider.style["margin-top"] = (slider.parentElement.clientHeight / 2 - 60) + "px";
		}
	});

  $scope.values = {
    pain: window.localStorage.pain || 5,
    productivity: window.localStorage.productivity || 5,
    activity: window.localStorage.activity || 5,
    mood: window.localStorage.mood || 5,
  };
  $scope.saveButtonText = 'Save';

  $scope.$on('$ionicView.enter', function(e) {});

  $scope.save = function() {
    window.localStorage.pain = $scope.values.pain;
    window.localStorage.productivity = $scope.values.productivity;
    window.localStorage.activity = $scope.values.activity;
    window.localStorage.mood = $scope.values.mood;

    var data = window.localStorage.data ? JSON.parse(window.localStorage.data) : [];
    data.push([(new Date()).toISOString(), {
      pain: parseInt($scope.values.pain),
      productivity: parseInt($scope.values.productivity),
      activity: parseInt($scope.values.activity),
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


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };


  $scope.clearData = function() {
    window.localStorage.clear();
  };

  $scope.loadData = function(filename) {
    var path = '/data/' + filename + '.csv';
    $.get(path, function(csv) {
        var data = $.csv.toObjects(csv);
        window.localStorage.data = JSON.stringify(data);
    });
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


});
