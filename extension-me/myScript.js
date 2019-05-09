var areWeDoingThisOrNot = false;

// TODO: read from confirm, user configured 
var urls = ["onet.pl", "michalstefanow.com", "localhost"];

urls.forEach(function(url) {
  if (location.href.indexOf(url) !== -1) { // FIXME: could be any part of URL
    areWeDoingThisOrNot = true;
  }
})


// https://stackoverflow.com/questions/28186349/chrome-extension-set-to-run-at-document-start-is-running-too-fast
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent);

function fireContentLoadedEvent () {
  console.log ("DOMContentLoaded");
  if(areWeDoingThisOrNot) {
    doThis();

    // setTimeout(function(){
    //   $("body").show(); // it is initially hidden in `styles.css`
    // }, 100);

  } else {
    $("body").show(); // show content, we are not one of these website
  }
}

// main function (not using sweat words in code)
function doThis() {
  let markup; // collapsible body, more screen real estate
  {     
    markup = `<div id="focus-mind"><div ng-view></div>
    <script type="text/ng-template" id="partials/home.html">
      <div class='overlay'>
        <h3>I am the overlay</h3>
        <p>You are on a website, known to be fucking distracting.</p>

        <form ng-submit="submit()">
          <iframe id="testing"></iframe>
          <label for="accomplish">What do you want to accomplish</label>
          <input id="accomplish" ng-model="accomplish" placeholder="what..." required>

          <br>


          <label for="howmuchtime">How much time is a sensible estimate</label>
          <input type="number" ng-model="minutes" placeholder="minutes...">
          <input type="number" ng-model="seconds" placeholder="second...">


          <input type="submit" value="I'm ready">
        </form>


      </div>
    </script>  

    <script type="text/ng-template" id="partials/countdown.html">
      <div class="countdown" >
        <p>You are here to: {{ accomplish }}</p>

        <div ng-show="state === 'init'">
          <p>Time left: {{ Math.floor(seconds/60) }} minutes {{ seconds % 60 }} seconds</p>
          <button ng-click="done()">done</button>
        </div>

        <div ng-show="state === 'toolate'">
          <p>Time overdue: {{ Math.floor(seconds/60) }} minutes {{ seconds % 60 }} seconds</p>
          <button ng-click="done()">done</button>
        </div>
      </div>

      <div class="overlay" ng-show="state === 'done'">
        <h1>Well done</h1>
      </div>
    </script>  

    <script type="text/ng-template" id="partials/countdown.html">
      <div class="countdown" >
        <p>You are here to: {{ accomplish }}</p>

        <div ng-show="state === 'init'">
          <p>Time left: {{ Math.floor(seconds/60) }} minutes {{ seconds % 60 }} seconds</p>
          <button ng-click="done()">done</button>
        </div>

        <div ng-show="state === 'toolate'">
          <p>Time overdue: {{ Math.floor(seconds/60) }} minutes {{ seconds % 60 }} seconds</p>
          <button ng-click="done()">done</button>
        </div>
      </div>

      <div class="overlay" ng-show="state === 'done'">
        <h1>Well done</h1>
      </div>
    </script>`
  }

  $(markup).prependTo("body");

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
    $scope.minutes = 1;
    $scope.seconds = 10;
    $scope.accomplish = "required";

    $scope.submit = function() {
      var seconds = $scope.minutes * 60 + $scope.seconds;
      countdown.start($scope.accomplish, seconds);
      return false;
    }

    $scope.$on('$viewContentLoaded', function(){
      $("body").show();
    });
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

  angular.element(function() {
    angular.bootstrap(document, ['app']);
    writeToFrame();
  });

  function writeToFrame() {
    var doc = document.getElementById('testing').contentWindow.document;
    doc.open();
    doc.write('<html><head><title></title><style>body{ background: blue }</style></head><body>Hello world.</body></html>');
    doc.close();
  }

  
};