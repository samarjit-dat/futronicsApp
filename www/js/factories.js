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
            if ($window.localStorage[key] != undefined)
                return JSON.parse($window.localStorage[key] || false);

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
                console.log('stateget');
                console.log(response);
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
        // }
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
            //return this.today.getDate() + '/' + (this.today.getMonth()+1) + '/' + this.today.getFullYear();
        }
    };

})

futronics.filter('mutedUser', function($localstorage) {
    return function(input) {
        var muteUserIdList = $localstorage.getObject('muteChatUser');
        var newArray = [];
        // muteUserIdList = 26;
        input.forEach(function(v) {
            if (muteUserIdList && muteUserIdList.indexOf(parseInt(v.id)) === -1) {
                newArray.push(v);
            }
            // newArray.push(v);
            if (!muteUserIdList) {
                newArray.push(v);
            }
        });
        return newArray;
    };
})