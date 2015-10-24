angular.module('starter.controllers', [])

.controller('GoalsCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.$on('$ionicView.enter', function(e) {
    initChart();
  });

  // parse a date in dd/mm/yyyy format
  var parseDate = function(input) {
    var parts = input.split('/');
    return Date.UTC(parts[2], parts[1] - 1, parts[0]);
  };

  var buildSeries = function() {
    var data = window.localStorage.data ? JSON.parse(window.localStorage.data) : [];

    var series = {};
    series.mood = [];
    series.pain = [];

    for (var i = 0; i < data.length; i++) {
      var date = parseDate(data[i].Date);
      series.mood.push([date, parseInt(data[i]['Pain slider score'])]);
      series.pain.push([date, parseInt(data[i]['Mood slider score'])]);
    }

    return series;
  };

  var initChart = function() {
    $(function() {
      var series = buildSeries();

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
        }, {
          type: 'line',
          name: 'Pain',
          data: series.pain
        }]
      });
    });
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {})

.controller('QuestionsCtrl', function($scope) {
  $scope.$on('$ionicView.enter', function(e) {
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
    var d = new Date();
    if (data.length > 0) {
      var dateSplit = data[data.length - 1].Date.split('/');
      d = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
      d.setDate(d.getDate() + 1);
    }
    data.push({
      uid: 1,
      Date: d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
      pain: parseInt($scope.values.pain),
      activity: parseInt($scope.values.activity),
      productivity: parseInt($scope.values.productivity),
      mood: parseInt($scope.values.mood),

      'user': '',
      'Pain slider score': parseInt($scope.values.pain),
      'Physical Activity slider score': parseInt($scope.values.activity),
      'Productivity slider score': parseInt($scope.values.productivity),
      'Mood slider score': parseInt($scope.values.mood),
      'Pain Type': '',
      'Pain Location': '',
      'Pain Notes Tell me more': '',
      'Physical Activity Tell me more': '',
      'Productivity Notes Tell me more': '',
      'Mood Notes Tell me more': '',
    });
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
    winHealthHack: true,
    enableNotifications: localStorage.enableNotifications ? JSON.parse(localStorage.enableNotifications) : false,
    notificationTime: localStorage.notificationTime ? new Date(localStorage.notificationTime) : (new Date(Math.round(Date.now() / (60 * 60 * 1000)) * 60 * 60 * 1000)),
    notificationFrequency: localStorage.notificationFrequency ? JSON.parse(localStorage.notificationFrequency) : 24,
  };

  var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

  $scope.winHealthHackChanged = function() {
    if ($scope.settings.winHealthHack) return;
    setTimeout(function() {
      $scope.settings.winHealthHack = true;
      $scope.$apply();
    }, 700);
  };

  $scope.notificationTimeChanged = function() {
    localStorage.enableNotifications = JSON.stringify($scope.settings.enableNotifications);
    localStorage.notificationTime = JSON.stringify($scope.settings.notificationTime);
    localStorage.notificationFrequency = JSON.stringify($scope.settings.notificationFrequency);

    if (typeof cordova === 'undefined') return;

    cordova.plugins.notification.local.cancel(2, function() {
      // Notification was cancelled
      if ($scope.settings.enableNotifications) {
        console.log('Created notification', $scope.settings.notificationTime, $scope.settings.notificationFrequency * 60);
        cordova.plugins.notification.local.schedule({
          id: 2,
          title: 'Dont forget to take your meds',
          message: 'And tell us how you feel.',
          firstAt: $scope.settings.notificationTime,
          every: $scope.settings.notificationFrequency * 60,
          sound: sound,
          icon: 'resources/icon.png'
        });
      }
    });


  };
  $scope.toggleNotifications = function() {
    localStorage.enableNotifications = JSON.stringify($scope.settings.enableNotifications);

    var scheduleNotification = function() {
      var date = new Date(Date.now() + 3 * 1000);

      $scope.notificationTimeChanged();

      cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Dont forget to take your meds',
        message: 'And tell us how you feel',
        at: date,
        sound: sound,
        icon: 'resources/icon.png'
      });

    };

    if (typeof cordova !== 'undefined' && $scope.settings.enableNotifications) {
      cordova.plugins.notification.local.hasPermission(function(granted) {
        if (!granted) {
          cordova.plugins.notification.local.registerPermission(function(granted) {
            if (!granted) {
              $scope.settings.enableNotifications = false;
              return $scope.toggleNotifications();
            }

            scheduleNotification();
          });
        } else {
          scheduleNotification();
        }
      });
    } else if (typeof cordova !== 'undefined') {
      cordova.plugins.notification.local.cancel(2, function() {
        // Notification was cancelled
      });
    }
  };


  $scope.clearData = function() {
    window.localStorage.clear();
    window.location = "/#/first-time";
  };

  $scope.loadData = function(filename) {
    var path = 'data/' + filename + '.csv';
    $.get(path, function(csv) {
      var data = $.csv.toObjects(csv);
      window.localStorage.data = JSON.stringify(data);
    });
  };

})


.controller('InfoCtrl', function($scope) {
  var chats = [{
    id: 0,
    name: 'IMB - CENTRE FOR PAIN RESEARCH',
    lastText: "Centre Objectives: Recognise",
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Chronic Pain Australia',
    lastText: "If you live with pain we can help you",
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Pain Australia',
    lastText: "Chronic Pain – Australia's Hidden Health Problem",
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Chronic Pain Support Group',
    lastText: "We're all in this together",
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Chronic Pain Meetups in Brisbane',
    lastText: "Get up and get going again with encouragement and support from others living with pain too.",
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];
})


.controller('FirstTimeCtrl', function($scope) {
  $scope.values = {
    username: window.localStorage.username || "",
    usergender: window.localStorage.usergender || "",
    userage: parseInt(window.localStorage.userage) || 30,
    usermedicalcondition: window.localStorage.usermedicalcondition || "",
    userproductiveday: window.localStorage.userproductiveday || "",
    userpainlocation: window.localStorage.userpainlocation || "",
  };

  $scope.$on('$ionicView.enter', function(e) {});

  $scope.save = function() {
    window.localStorage.username = $scope.values.username;
    window.localStorage.usergender = $scope.values.usergender;
    window.localStorage.userage = $scope.values.userage;
    window.localStorage.usermedicalcondition = $scope.values.usermedicalcondition;
    window.localStorage.userproductiveday = $scope.values.userproductiveday;
    window.localStorage.userpainlocation = $scope.values.userpainlocation;
  };

  //   app.controller('myController', function($scope) {
  //   "use strict";
  //   // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
  //   $scope.options = {
  //     defaultDate: "2015-08-06",
  //     minDate: "2015-01-01",
  //     maxDate: "2015-12-31",
  //     disabledDates: [
  //         "2015-06-22",
  //         "2015-07-27",
  //         "2015-08-13",
  //         "2015-08-15"
  //     ],
  //     dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
  //     mondayIsFirstDay: true,//set monday as first day of week. Default is false
  //     eventClick: function(date) {
  //       console.log(date);
  //     },
  //     dateClick: function(date) {
  //       console.log(date);
  //     },
  //     changeMonth: function(month, year) {
  //       console.log(month, year);
  //     },
  //     filteredEventsChange: function(filteredEvents) {
  //       console.log(filteredEvents);
  //     },
  //   };
  //
  //   $scope.events = [
  //     {foo: 'bar', date: "2015-08-18"},
  //     {foo: 'bar', date: "2015-08-20"}
  //   ];
  // });


});
