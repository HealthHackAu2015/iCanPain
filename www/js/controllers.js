  var parseDate = function(input) {
    var parts = input.split('/');
    return Date.UTC(parts[2], parts[1] - 1, parts[0]);
  };

  var buildSeries = function() {
    var data = window.localStorage.data ? JSON.parse(window.localStorage.data) : [];

    var series = {};
    series.mood = [];
    series.pain = [];
    series.activity = [];
    series.productivity = [];
    series.xAxis = [];

    series.weeklymood = [];
    series.weeklypain = [];
    series.weeklyactivity = [];
    series.weeklyproductivity = [];
    series.weeklyextremepain= [];

    var weeklymoodtemp = 0;
    var weeklypaintemp = 0;
    var weeklyactivitytemp = 0;
    var weeklyproductivitytemp = 0;
    var weeklyextremepaintemp = 0;

    var firstdate = data[0].Date;
    var weeklengthmicroseconds = 604800000;
    var activeweek = 0;
    var weekcounter = 0;

    for (var i = 0; i < data.length; i++) {
      var date = parseDate(data[i].Date);
      week = Math.floor((date-parseDate(firstdate))/weeklengthmicroseconds);
      series.mood.push([date, parseInt(data[i]['Mood slider score'])]);
      series.pain.push([date, parseInt(data[i]['Pain slider score'])]);
      series.activity.push([date, parseInt(data[i]['Physical Activity slider score'])]);
      series.productivity.push([date, parseInt(data[i]['Productivity slider score'])]);

      if (week == activeweek)
      {
        weeklymoodtemp = weeklymoodtemp+parseInt(data[i]['Mood slider score']);
        weeklypaintemp = weeklypaintemp+parseInt(data[i]['Pain slider score']);
        weeklyactivitytemp = weeklyactivitytemp+parseInt(data[i]['Physical Activity slider score']);
        weeklyproductivitytemp = weeklyproductivitytemp+parseInt(data[i]['Productivity slider score']);
        if (parseInt(data[i]['Pain slider score']) >= 8)
        {
          weeklyextremepaintemp= weeklyextremepaintemp+1;
        }
        weekcounter++;
      }
      else
      {
        series.weeklymood.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklymoodtemp/weekcounter*100)/100)
        ]);
        series.weeklypain.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklypaintemp/weekcounter*100)/100)
        ]);
        series.weeklyactivity.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklyactivitytemp/weekcounter*100)/100)
        ]);
        series.weeklyproductivity.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklyproductivitytemp/weekcounter*100)/100)
        ]);
        series.weeklyextremepain.push([
          "wk "+String(week),
          weeklyextremepaintemp
        ]);

        series.xAxis.push("wk "+String(week));
        weekcounter = 0;
        weeklymoodtemp = 0;
        weeklypaintemp = 0;
        weeklyactivitytemp = 0;
        weeklyproductivitytemp = 0;
        weeklyextremepaintemp = 0;
        activeweek = week;
      }
    }
    series.weeklymood.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklymoodtemp/weekcounter*100)/100)
        ]);
    series.weeklypain.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklypaintemp/weekcounter*100)/100)
        ]);
    series.weeklyactivity.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklyactivitytemp/weekcounter*100)/100)
        ]);
    series.weeklyproductivity.push([
          "wk "+String(week),
          parseFloat(parseInt(weeklyproductivitytemp/weekcounter*100)/100)
        ]);
    series.weeklyextremepain.push([
          "wk "+String(week),
          weeklyextremepaintemp
        ]);
    series.xAxis.push("wk "+String(week+1));
   return series;
  };



angular.module('starter.controllers', [])

.controller('GoalsCtrl', function($scope) {
  $scope.$on('$ionicView.enter', function(e) {
    window.location = '#/questions/pain';
  });
})

.controller('ChatsCtrl', function ($scope, $stateParams, EncouragmentPopups) {
   $scope.$on('$ionicView.enter', function(e) {
     initChart();
   });

  var initChart = function() {
    $(function() {
      var series = buildSeries();
      activedata = series.weeklypain;
      chart = new Highcharts.Chart({
        chart: {
           renderTo: 'container',
            defaultSeriesType: 'column',

        },
        title: {
          text: 'Your Weekly History'
        },
        colors: ['#F4AC1C'],
        xAxis: {
          categories: series.xAxis
        },
        yAxis: {
          title: {
            text: 'Pain Impact'
          },
          ceiling: 10
        },
        legend: {
          enabled: false
        },
         plotOptions: {
           column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
          type: 'column',
          name: 'Average Mood',
          data: activedata
        }]
      });
    });
  };

  $scope.ShowPain = function(){
    var series = buildSeries();
    console.log(series.weeklypain);
    var newSeriesOptions = {
      name: "Average Pain",
      color: '#F4AC1C'
    };
    chart.series[0].update(newSeriesOptions);
    chart.series[0].setData(series.weeklypain);
  };

  $scope.ShowMood = function(){
    var series = buildSeries();
    var newSeriesOptions = {
      name: "Average Mood",
      color: '#4453C7'
    };
    chart.series[0].update(newSeriesOptions);
    chart.series[0].setData(series.weeklymood);

  };

  $scope.ShowActivity = function(){
    var series = buildSeries();
    var newSeriesOptions = {
      name: "Average Mood",
      color: '#A7CAFB'
    };
    chart.series[0].update(newSeriesOptions);
    chart.series[0].setData(series.weeklyactivity);
  };

  $scope.ShowProductivity = function(){
    var series = buildSeries();
    var newSeriesOptions = {
      name: "Average Productivity",
      color: '#15B659'
    };
    chart.series[0].update(newSeriesOptions);
    chart.series[0].setData(series.weeklyproductivity);
  };

  $scope.ShowExtremePain= function(){
    var series = buildSeries();
    var newSeriesOptions = {
      name: "Number of Extreme Pain Events",
      color: '#A10018'
    };
    chart.series[0].update(newSeriesOptions);
    chart.series[0].setData(series.weeklyextremepain);
  };
})

.controller('DoctorCtrl', function ($scope, $stateParams, EncouragmentPopups) {
   $scope.$on('$ionicView.enter', function(e) {
     initDoctorChart();
   });
   var initDoctorChart = function() {
    $(function() {
      var series = buildSeries();
      if (series.xAxis.length <8)
      {
          return;
      }
      var thismonthmood = 0;
      var thismonthpain = 0;
      var thismonthactivity = 0;
      var thismonthproductivity = 0;
      var thismonthextreme = 0;

      var lastmonthmood = 0;
      var lastmonthpain = 0;
      var lastmonthactivity = 0;
      var lastmonthproductivity = 0;
      var lastmonthextreme = 0;

      for (var i = series.xAxis.length-6; i<series.xAxis.length-2; i++)
      {
        thismonthmood = thismonthmood + series.weeklymood[i][1]/4;

        thismonthpain = thismonthpain + series.weeklypain[i][1]/4;
        thismonthactivity = thismonthactivity + series.weeklyactivity[i][1]/4;
        thismonthproductivity = thismonthproductivity + series.weeklyproductivity[i][1]/4;
        thismonthextreme =thismonthextreme + series.weeklyextremepain[i][1]/4;
      }



      for (var i = series.xAxis.length-10; i<series.xAxis.length-6; i++)
      {
        lastmonthmood = lastmonthmood + series.weeklymood[i][1]/4;
        lastmonthpain = lastmonthpain + series.weeklypain[i][1]/4;
        lastmonthactivity = lastmonthactivity + series.weeklyactivity[i][1]/4;
        lastmonthproductivity = lastmonthproductivity + series.weeklyproductivity[i][1]/4;
        lastmonthextreme = lastmonthextreme + series.weeklyextremepain[i][1]/4;
  }

      console.log([thismonthpain, thismonthactivity,thismonthproductivity,thismonthmood,thismonthextreme])
      console.log([lastmonthpain, lastmonthactivity,lastmonthproductivity,lastmonthmood,lastmonthextreme])

      activedata = series.weeklypain;
      chart = new Highcharts.Chart({
        chart: {
           renderTo: 'Doctorcontainer',
            defaultSeriesType: 'column',

        },
        title: {
          text: 'Your Last Month'
        },
        colors: ['#4453c7'],
        xAxis: {
          categories: ["Pain","Activity","Productivity","Mood","Extreme Pain"]
        },
        yAxis: {
          title: {
            text: 'Pain Impact'
          },
          ceiling: 10
        },
        legend: {
          enabled: false
        },
         plotOptions: {
           column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
          type: 'column',
          name: 'Last 4 weeks',
          data: [thismonthpain, thismonthactivity,thismonthproductivity,thismonthmood,thismonthextreme]
        }]
      });

      chart = new Highcharts.Chart({
        chart: {
           renderTo: 'Doctorcontainer2',
            defaultSeriesType: 'column',

        },
        title: {
          text: 'Change since last month'
        },
        colors: ['#F4AC1C'],

        xAxis: {
          categories: ["Pain","Activity","Productivity","Mood","Extreme Pain"]
        },
        yAxis: {
          title: {
            text: 'Pain Impact'
          },
          ceiling: 10
        },
        legend: {
          enabled: false
        },
         plotOptions: {
           column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
          type: 'column',
          name: 'Last 4 weeks',
          data: [
          thismonthpain - lastmonthpain,
          thismonthactivity - lastmonthactivity,
          thismonthproductivity - lastmonthproductivity,
          thismonthmood - lastmonthmood,
          thismonthextreme - lastmonthextreme
          ]
        }]
      });





    });


  };


})



.controller('QuestionsCtrl', function ($scope, $ionicPopup, EncouragmentPopups) {
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

  $scope.addDetails = function (detailsVarName, nextButtonId) {
    $scope.values[detailsVarName] = $scope.values[detailsVarName] || '';
    var myPopup = $ionicPopup.show({
      template: '<textarea style="border: 1px silver solid;" rows="6" id="inputText">' + $scope.values[detailsVarName] + '</textarea>',
      title: 'What happened?',
      //subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        {
          text: '<b>Cancel</b>',
          type: 'button-negative'
        },
        {
          text: '<b>Save</b>',
          type: 'button-balanced',
          onTap: function (e) {
            if (!inputText.value) {
              //don't allow the user to close unless he enters wifi password
              alert('Please enter more details for what is wrong' + inputText.value);
              e.preventDefault();
            } else {
              $scope.values[detailsVarName] = inputText.value;
              var toClick = document.getElementById(nextButtonId);
              console.log(toClick);
              if (toClick)
              {
                if (toClick.onclick)
                  toClick.onclick();
                if (toClick.href)
                  window.location.hash = '#' + toClick.href.split('#', 2)[1];
                //document.createEvent("MouseEvents");
                //event.initMouseEvent("click", true, true, window,
                //    0, 0, 0, 0, 0,
                //    false, false, false, false,
                //    0, null);
                //toClick.dispatchEvent(event);
              }
            }
          }
        }
      ]
    });
    //myPopup.then(function (res) {
    //  console.log('Tapped!', res);
    //});
  };

  $scope.tryForceTellMeMore = function ($event, currentSetting, detailsVarName, nextButtonId) {
    if (currentSetting >= 8 && !$scope.values[detailsVarName])
    {
      $scope.addDetails(detailsVarName, nextButtonId);
      $event.preventDefault();
    }
  };

  $scope.values = {
    pain: window.localStorage.pain || 5,
    productivity: window.localStorage.productivity || 5,
    activity: window.localStorage.activity || 5,
    mood: window.localStorage.mood || 5,
    painDetails: '',
    activityDetails: '',
    productivityDetails: '',
    moodDetails: '',
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
      'Pain Notes Tell me more': $scope.values.painDetails,
      'Physical Activity Tell me more': $scope.values.activityDetails,
      'Productivity Notes Tell me more': $scope.values.productivityDetails,
      'Mood Notes Tell me more': $scope.values.moodDetails,
    });
    window.localStorage.data = JSON.stringify(data);

    $scope.saveButtonText = 'Saved';
    setTimeout(function() {
      $scope.saveButtonText = 'Save';
      $scope.$apply();
    }, 2000);

    $scope.values.painDetails = '';
    $scope.values.activityDetails = '';
    $scope.values.productivityDetails = '';
    $scope.values.moodDetails = '';

    EncouragmentPopups.showEncouragement($scope);
  };

})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    winHealthHack: true,
    enableNotifications: localStorage.enableNotifications ? JSON.parse(localStorage.enableNotifications) : false,
    notificationTime: localStorage.notificationTime ? new Date(localStorage.notificationTime) : (new Date(Math.round(Date.now() / (60 * 60 * 1000)) * 60 * 60 * 1000)),
    notificationFrequency: localStorage.notificationFrequency ? JSON.parse(localStorage.notificationFrequency) : 24,
  };

  var sound = typeof device !== 'undefined' && device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

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
          // sound: sound,
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
        // sound: sound,
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
  };

  $scope.loadData = function(filename) {
    var path = 'data/' + filename + '.csv';
    $.get(path, function(csv) {
      var data = $.csv.toObjects(csv);
      window.localStorage.data = JSON.stringify(data);

      window.localStorage.username = "Shelly";
      window.localStorage.usergender = "Female";
      window.localStorage.userage = 18;
      window.localStorage.usermedicalcondition = 'Erythromelalgia';
      window.localStorage.usermedications = 'Nurofen Plus';
      window.localStorage.userpainlocation = 'Feet';
    });
  };

})


.controller('InfoCtrl', function($scope) {
})

.controller('HistoryCtrl', function($scope, $stateParams, EncouragmentPopups) {
  $scope.$on('$ionicView.enter', function (e) {
    if ($stateParams.from && $stateParams.from.toLowerCase() == "questionaire") {
      // EncouragmentPopups.showEncouragement($scope);
    }
  });
})


.controller('FirstTimeCtrl', function($scope) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.values = {
      username: window.localStorage.username || "",
      usergender: window.localStorage.usergender || "",
      userage: parseInt(window.localStorage.userage) || 30,
      usermedicalcondition: window.localStorage.usermedicalcondition || "",
      usermedications: window.localStorage.usermedications || "",
      userpainlocation: window.localStorage.userpainlocation || "",
    };
  });

  $scope.save = function() {
    window.localStorage.username = $scope.values.username;
    window.localStorage.usergender = $scope.values.usergender;
    window.localStorage.userage = $scope.values.userage;
    window.localStorage.usermedicalcondition = $scope.values.usermedicalcondition;
    window.localStorage.usermedications = $scope.values.userproductiveday;
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
