futronics.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || false;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            if ($window.localStorage[key] != undefined) return JSON.parse($window.localStorage[key] || false);
            return false;
        },
        remove: function(key) {
            $window.localStorage.removeItem(key);
        },
        clear: function() {
            $window.localStorage.clear();
        }
    }
}]);
futronics.factory('Loader', function loaderFactory($ionicPopup, $ionicLoading) {
    return {
        showLoading: function() {
            $ionicLoading.show({ template: 'Loading...' });
        },
        hideLoading: function() {
            $ionicLoading.hide();
        },
        show: function(success) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Futronics',
                content: success
            });
        },
        hide: function(error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Futronics',
                content: error
            });
        }
    }
});

futronics.factory("stateFactory", ['$localstorage', 'checkingCurrentState', '$rootScope', function($localstorage, checkingCurrentState, $rootScope) {

    var thisObj = {};
    var name;
    thisObj.setCurrentState = function(name, user_id) {
        var param = { user_id: user_id, curr_stat: name };
        var data = $rootScope.formatInputString(param);
        checkingCurrentState.post(data).then(function(response) {
            if (response.data.status == 1) {
                $localstorage.set("currentSate", name);
            } else if (response.data.status == 2) {
                $localstorage.set("currentSate", name);
            } else {
                toastr.error('Sorry,Something went wrong.Try again...');
                return false;
            }
        });
    }
    thisObj.getCurrentState = function(user_id) {
        var param = { user_id: user_id };
        var data = $rootScope.formatInputString(param);
        checkingCurrentState.get(data).then(function(response) {
            if (response.data.status == 1) {
                name = response.data.result[0].curr_stat;
                $localstorage.set("currentSate", name);
                if ($localstorage.get("currentSate"))
                    return $localstorage.get("currentSate");
            } else if (response.data.status == 2) {
                name = response.data.result[0].curr_stat;
                $localstorage.set("currentSate", name);
                if ($localstorage.get("currentSate"))
                    return $localstorage.get("currentSate");
            } else {
                toastr.error('Sorry,Something went wrong.Try again...');
                return false;
            }
        });
    }
    return thisObj;
}]);
futronics.factory('TimeAndDateFactory', function($q) {
    return {
        today: new Date(),
        getCurrentTime: function() {
            var hrs = (this.today.getHours() < 10) ? '0' : this.today.getHours(),
                min = (this.today.getMinutes() < 10) ? '0' : this.today.getMinutes(),
                sec = (this.today.getSeconds() < 10) ? '0' : this.today.getSeconds();
            return hrs + ":" + min + ":" + sec;
        },
        getTodayDate: function() {
            return this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate();
        }
    };

})

futronics.filter('mutedUser', function($localstorage) {
    return function(input) {
        var muteUserIdList = $localstorage.getObject('muteChatUser');
        var newArray = [];
        input.forEach(function(v) {
            if (muteUserIdList && muteUserIdList.indexOf(parseInt(v.id)) === -1) {
                newArray.push(v);
            }
            if (!muteUserIdList) {
                newArray.push(v);
            }
        });
        return newArray;
    };
})

futronics.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork) {
    return {
        isOnline: function() {
            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function() {
            if (ionic.Platform.isWebView()) {
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }
        }
    }
});

futronics.factory("AccountService", function($http, $q, $localstorage, URL, Loader) {
    var userInfo;

    function login(data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/userLogin",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(result) {
            userInfo = {
                accessToken: result.data.access_token,
                userInfo: result.data
            };
            if (result.data.status !== 0) {
                $localstorage.setObject("userInfo", userInfo);
                deferred.resolve(userInfo);
            }
            if (result.data.status === 0) {

                deferred.resolve(userInfo);
            }

        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function signup(data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/campaignSignup",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(result) {
            userInfo = {
                accessToken: result.data.access_token,
                userInfo: result.data
            };
            $localstorage.setObject("userInfo", userInfo);
            deferred.resolve(userInfo);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }


    function updateCardDetailsLogin(data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/updateCardDetailsLogin",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(result) {
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/api/logout",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(result) {
            userInfo = null;
            $localstorage.remove('userInfo');
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($localstorage.getObject("userInfo")) {
            userInfo = $localstorage.getObject("userInfo");
        }
    }
    init();

    return {
        login: login,
        signup: signup,
        logout: logout,
        getUserInfo: getUserInfo,
        updateCardDetailsLogin: updateCardDetailsLogin
    };
});