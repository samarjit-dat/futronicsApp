futronics.controller('UpdateCampaignCtrl',
    function($scope, StorageService, QuestionOneService, $rootScope,
        $state, $localstorage, $ionicPopup, stateFactory, LogoutService) {
        StorageService.storage();
        // For getting value stateFactory.getCurrentState()
        stateFactory.setCurrentState($state.current.name);

        $scope.logout = function() {
            LogoutService.logout();
        };
        $scope.myOwnProfile = function() {
            localStorage.removeItem('viewIndividualProfile_globalChat');
            localStorage.setItem('myProfile', '1');
            $state.go('profile');
        };
    });