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
       if($window.localStorage[key] != undefined)
        return JSON.parse($window.localStorage[key] || false );
    
       return false;
      },
      remove: function(key){
       $window.localStorage.removeItem(key);
      },
      clear: function(){
       $window.localStorage.clear();
      }
     }
}]);
futronics.factory('Loader', function loaderFactory ($ionicPopup,$ionicLoading) {
  return {
    showLoading:function () {
       $ionicLoading.show({template: 'Loading...'});  
    },
    hideLoading:function () {
       $ionicLoading.hide();  
    },
    show: function (success) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Futronics',
          content: success
       });
    },
    hide: function (error) {
       $ionicLoading.hide(); 
        $ionicPopup.alert({
            title: 'Futronics',
            content: error
        });
    }
  }  
});

futronics.factory("stateFactory",function($localstorage){

    var thisObj = {};

    thisObj.setCurrentState = function(name) {
        $localstorage.set("currentSate",name);
    }

    thisObj.getCurrentState = function() {
        return $localstorage.get("currentSate");
    }

    return thisObj;

});
futronics.factory('TimeAndDateFactory', function($q) {
    return {
        today : new Date(),
        getCurrentTime: function() {
            var hrs = (this.today.getHours() < 10) ? '0' : this.today.getHours(),
                min = (this.today.getMinutes() < 10) ? '0' : this.today.getMinutes(),
                sec = (this.today.getSeconds() < 10) ? '0' : this.today.getSeconds();
            return hrs+":"+ min +":"+sec;
        },
        getTodayDate: function() {
            return this.today.getFullYear() + '-' + (this.today.getMonth()+1) + '-' + this.today.getDate();
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
        if(muteUserIdList && muteUserIdList.indexOf(parseInt(v.id)) === -1) {
            newArray.push(v);
        }
        // newArray.push(v);
        if(!muteUserIdList){
            newArray.push(v);
        }
    });
    return newArray;
  };
})