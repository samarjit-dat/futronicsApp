var futronics = angular.module('futronics', ['ionic', 'ngAnimate','ngCordova','ngIOS9UIWebViewPatch','ionic-pullup','rzModule','ngSanitize','angular-md5','firebase'])

futronics.run(function($ionicPlatform,$state,$timeout,$rootScope) {
    
  $ionicPlatform.ready(function() {
      $rootScope.animate = false;
      
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $rootScope.noMore = 0;
    $rootScope.isMaintain = localStorage.isMaintainPhase;
   });
   $ionicPlatform.registerBackButtonAction(function (event) {
       //alert($state.current.name);
        var count=0;
    if ($state.current.name=="globalChat"){
         //alert($state.current.name);
        //$ionicHistory.clearCache();
        //$ionicHistory.clearHistory();
          count +=1;
        if(count===1){
            window.plugins.toast.showWithOptions(
            {
              message: "Tap back button to exit",
              duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            },
            onSuccess, // optional
            onError    // optional
          );
        }else{
           navigator.app.exitApp(); 
        }
       
    }else {
      navigator.app.backHistory();
    }
  }, 100);
});

/// For android device back button
futronics.run(function ($ionicPlatform, $ionicPopup,$ionicHistory,$rootScope,$state,Loader) {
    $ionicPlatform.ready(function () {
       // alert('online');
      // $rootScope.isMaintain = localStorage.isMaintainPhase;
        document.addEventListener("online",$rootScope.onLineStatus=navigator.onLine,false);
        //alert($rootScope.onLineStatus);
        if(!$rootScope.onLineStatus){
           $ionicPopup.show({
                template: '<div style="text-align:center;">You are now offline.<br/>Please check your network connection</div>',
               // scope: $scope,
                buttons: [
                    { 
                        text: 'Ok' ,
                        type: 'button-calm',
                        onTap: function(e) {
                          return;
                        }
                    }
                ]
            });
            
            Loader.hideLoading();
        }
        
//        // $ionicConfig.views.maxCache(0);
//        $ionicPlatform.registerBackButtonAction(function (event) {
//                if ($state.current.name=="login" || $state.current.name=="signup" || $state.current.name=="globalChat"){
//                    $ionicHistory.clearCache();
//                    $ionicHistory.clearHistory();
//                    navigator.app.exitApp();
//                }
//                else {
//                    
//                  navigator.app.backHistory();
//                }
//                event.preventDefault();
//                return false;
//        }, 101);            
    });

});
futronics.run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeSuccess", function(userInfo) {
      $rootScope.isMaintain = localStorage.isMaintainPhase;
    });

    $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
          $location.path("/login");
        }
    });
}]);
futronics.run(function($rootScope,$ionicModal) {
    $rootScope.previousState = '';
    $rootScope.currentState = '';

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
      $rootScope.isMaintain = localStorage.isMaintainPhase;
    });  

    $rootScope.formatInputString = function (obj) {
      var p = [];
      for (var key in obj) 
      {
        p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    };
    
    $rootScope.previousState = '';
    $rootScope.currentState = '';

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
      $rootScope.isMaintain = localStorage.isMaintainPhase;
    });
    
    
   
});
futronics.config(['$ionicConfigProvider',function($ionicConfigProvider){
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.scrolling.jsScrolling(false);
}]);

futronics.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});