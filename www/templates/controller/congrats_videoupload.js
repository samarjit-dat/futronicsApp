futronics.controller('CongratsVideoUploadCtrl', function($scope,$ionicHistory,
    stateFactory,StorageService,check_GlobalCommunity,UserListService,$q, 
    $window,AccountService, $localstorage,$rootScope,$ionicPopup,ionPullUpFooterState,
    Loader, $timeout,$state,LogoutService,newsFeedServices,$ionicSlideBoxDelegate) {
         
        $scope.logout=function(){
           LogoutService.logout();
        };
        StorageService.storage();
        $scope.myOwnProfile=function(){
        
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          localStorage.setItem('hideuploadpage',1);
          $state.go('profile');
        };

    });

