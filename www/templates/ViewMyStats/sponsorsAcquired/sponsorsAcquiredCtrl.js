futronics.controller('sponsorsAcquiredCtrl',
    function($scope, $rootScope, AccountService, UserListService, check_GlobalCommunity,
        $ionicHistory, StorageService, $ionicModal, $sce, $http, $state,
        $window, $localstorage, $ionicPopup, URL, $location, IMAGE, $stateParams, SponsorsAcquired) {
        var campaignid = localStorage.getItem('campaign_id');
        var userdata = {
            user_logdin_id: $rootScope.user_id,
            user_campaign_id: campaignid
        };
        var data = $rootScope.formatInputString(userdata);
        SponsorsAcquired.contributionToMe(data).then(function(res) {
            $scope.contributins = res.data.result.contributor;
            if ($scope.contributins.length === 0) {
                $scope.show_nouser = 1;
            } else {
                $scope.show_nouser = 0;
            }
        })

        $scope.goToUserProfile = function(data) {
            $localstorage.set('mySponsors_userProfile', JSON.stringify(data));
            $state.go('mySponsorsUserProfile', { id: data.user_id });
        };
    });