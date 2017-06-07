var futronics = angular.module('futronics', ['ionic', 'ngAnimate', 'ngCordova', 'ngIOS9UIWebViewPatch', 'ionic-pullup', 'rzModule', 'ngSanitize', 'angular-md5', 'firebase'])

futronics.run(function($ionicPlatform, $state, $timeout, $ionicPopup, $rootScope, ConnectivityMonitor) {
    $ionicPlatform.ready(function() {
        $rootScope.animate = false;
        // Check for network connection
        if (ConnectivityMonitor.isOffline()) {
            $ionicPopup.show({
                template: '<div style="text-align:center;">You are now offline.<br/>Please check your network connection</div>',
                buttons: [{
                    text: 'Ok',
                    type: 'button-calm',
                    onTap: function(e) {
                        return;
                    }
                }]
            });

            Loader.hideLoading();
        }

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {

            StatusBar.styleDefault();
        }
        $rootScope.noMore = 0
        $rootScope.isMaintain = localStorage.isMaintainPhase;
    });
    $ionicPlatform.registerBackButtonAction(function(event) {
        var count = 0;
        if ($state.current.name == "globalChat") {
            count += 1;
            if (count == 1) {
                window.plugins.toast.showWithOptions({
                        message: "Tap back button to exit",
                        duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                        position: "bottom",
                        addPixelsY: -40 // added a negative value to move it up a bit (default 0)
                    },
                    onSuccess, // optional
                    onError // optional
                );
            } else {
                navigator.app.exitApp();
            }

        } else {
            navigator.app.backHistory();
        }
    }, 100);
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

futronics.run(function($rootScope, $ionicModal) {
    $rootScope.previousState = '';
    $rootScope.currentState = '';

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        $rootScope.isMaintain = localStorage.isMaintainPhase;
    });

    $rootScope.formatInputString = function(obj) {
        var p = [];
        for (var key in obj) {
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
futronics.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.scrolling.jsScrolling(false);
}]);

futronics.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});