futronics.factory("AccountService",function ($http, $q, $localstorage,URL,Loader) {
    var userInfo;
    function login(data) {
        console.log('login');
        console.log(data);
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/userLogin",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function (result) {
                userInfo = {
                    accessToken: result.data.access_token,
                    userInfo: result.data
                };
                console.log(result);
                if(result.data.status!==0){
                     $localstorage.setObject("userInfo",userInfo);
                     deferred.resolve(userInfo);
                }
                if(result.data.status===0){
                  
                   deferred.resolve(userInfo);
                }
               
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }
    
    function signup(data) {
        var deferred = $q.defer();
       $http({
            method: "POST",
            url: URL.BASE+"/campaignSignup",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function (result) {
                userInfo = {
                    accessToken: result.data.access_token,
                    userInfo: result.data
                };
                $localstorage.setObject("userInfo",userInfo);
                deferred.resolve(userInfo);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }
    
    
    function updateCardDetailsLogin(data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/updateCardDetailsLogin",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function (result) {
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    
    function logout() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/api/logout",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (result) {
            userInfo = null;
            $localstorage.remove('userInfo');
            deferred.resolve(result);
        }, function (error) {
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
        signup:signup,
        logout: logout,
        getUserInfo: getUserInfo,
        updateCardDetailsLogin : updateCardDetailsLogin
    };
});
