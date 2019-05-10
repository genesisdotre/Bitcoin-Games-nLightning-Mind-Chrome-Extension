var app = angular.module("app", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'partials/home.html',
      controller: "HomeCtrl"
    })
    .when('/countdown', {
      templateUrl: 'partials/countdown.html',
      controller: "CountdownCtrl"
    })
    .when('/settings', {
      templateUrl: 'partials/settings.html',
      controller: "SettingsCtrl"
    })
    .otherwise('/home')
});

app.controller("HomeCtrl", function($scope, countdown) {
  $scope.minutes = 0;
  $scope.seconds = 3;
  $scope.accomplish = "required";

  $scope.submit = function() {
    var seconds = $scope.minutes * 60 + $scope.seconds;
    countdown.start($scope.accomplish, seconds);
    return false;
  }
});      

app.controller("CountdownCtrl", function($scope, $location, countdown) {
  $scope.Math = window.Math;
  $scope.accomplish = countdown.accomplish;
  $scope.seconds = countdown.seconds;
  $scope.state = 'init';

  if (!$scope.accomplish) { $location.path("/"); }  // checking if we are initialized

  $scope.$on("second", function(event, data) {
    

    if (data.seconds < 0) {
      $scope.state = 'toolate';
      $scope.seconds = Math.abs(data.seconds);
    } else {
      $scope.seconds = data.seconds;
    }

    $scope.$apply();
  })

  $scope.done = function() {
    $scope.state = 'done';
    countdown.stop();
  }
  
});

app.controller("SettingsCtrl", function($scope) {
  $scope.message = "It works!";
});

app.service("countdown", function($rootScope, $location) {
  var countdown = {};

  countdown.start = function(accomplish, seconds) {
    countdown.accomplish = accomplish;
    countdown.seconds = seconds;
    countdown.intervalId = setInterval(function() {
      countdown.seconds--;

      $rootScope.$broadcast("second", {seconds: countdown.seconds})
      
    }, 1000);

    $location.path("countdown");
  }

  countdown.stop = function() {
    clearInterval(countdown.intervalId);
  }

  return countdown;

})