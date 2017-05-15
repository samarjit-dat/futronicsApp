
futronics.controller('UpdateCampaignCtrl', 
    function($scope,StorageService,QuestionOneService,$rootScope,
        $state,$localstorage,$ionicPopup,stateFactory,LogoutService) {
             StorageService.storage();
             stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
             
              $scope.logout=function(){
                LogoutService.logout();
            };
            $scope.myOwnProfile=function(){
                //alert('data');
                localStorage.removeItem('viewIndividualProfile_globalChat');
                localStorage.setItem('myProfile','1');
                $state.go('profile');
            };
        });