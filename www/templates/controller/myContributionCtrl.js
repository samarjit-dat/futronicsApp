futronics.controller('myContributionCtrl', function($scope,StorageService,QuestionOneService,$rootScope,$window,$state,$localstorage,$ionicPopup) {
    
    StorageService.storage();
    if($rootScope.contributions==[] || $rootScope.contributions==null || $rootScope.contributions==''){
        $scope.checkContributions=0;
    }

    
    $scope.goToMYContributionsUserDetails=function(data){
        console.log(data.user_id)
        /* *** data====>>>my contributions user details **** */
        $localstorage.set('myContribution_userProfile',JSON.stringify(data));
        $state.go('myContributionUserProfile',{id:data.user_id});
    };
});
