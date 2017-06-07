futronics.controller('myContributionCtrl', function($scope, StorageService, QuestionOneService, $rootScope, $window, $state, $localstorage, $ionicPopup) {

    StorageService.storage();
    if ($rootScope.contributions == [] || $rootScope.contributions == null || $rootScope.contributions == '') {
        $scope.checkContributions = 0;
    }

    $scope.goToMYContributionsUserDetails = function(data) {
        $localstorage.set('myContribution_userProfile', JSON.stringify(data));
        $state.go('myContributionUserProfile', { id: data.user_id });
    };

    $scope.goToPrev = function() {
        if ($rootScope.previousState)
            if ($rootScope.previousState == 'profile') {
                $state.go($rootScope.previousState);
            } else if ($rootScope.previousState == 'profileViewStats') {
            $state.go($rootScope.previousState);
        } else {
            $state.go('profile');
        }

    };
});