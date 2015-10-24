// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'flexcalendar', 'pascalprecht.translate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('first-time', {
    url: '/first-time',
    templateUrl: 'templates/first-time.html',
    controller: 'FirstTimeCtrl'
  })
  .state('questions', {
    url: '/questions',
    abstract: true,
    templateUrl: 'templates/questions.html'
  })
  .state('questions.pain', {
    url: '/pain',
    views: {
      'questions-pain': {
        templateUrl: 'templates/qns-pain.html',
        controller: 'QuestionsCtrl'
      }
    }
  })
  .state('questions.activity', {
    url: '/activity',
    views: {
      'questions-activity': {
        templateUrl: 'templates/qns-activity.html',
        controller: 'QuestionsCtrl'
      }
    }
  })
  .state('questions.productivity', {
    url: '/productivity',
    views: {
      'questions-productivity': {
        templateUrl: 'templates/qns-productivity.html',
        controller: 'QuestionsCtrl'
      }
    }
  })
  .state('questions.mood', {
    url: '/mood',
    views: {
      'questions-mood': {
        templateUrl: 'templates/qns-mood.html',
        controller: 'QuestionsCtrl'
      }
    }
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('calendar', {
    url: '/history/calendar',
    templateUrl: 'templates/history-calendar.html'
  })

  .state('charts', {
    url: '/history/charts',
    templateUrl: 'templates/history-charts.html',
    controller: 'ChatsCtrl'
  })

  .state('doctor', {
    url: '/history/doctor',
    templateUrl: 'templates/history-doctor.html'
  })
  // Each tab has its own nav history stack:

  .state('tab.goals', {
    url: '/goals',
    views: {
      'tab-goals': {
        templateUrl: 'templates/tab-goals.html',
        controller: 'GoalsCtrl'
      }
    }
  })

    .state('tab.info', {
    url: '/info',
    views: {
      'tab-info': {
        templateUrl: 'templates/tab-info.html',
        controller: 'InfoCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/first-time');

});
