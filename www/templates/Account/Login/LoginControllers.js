
futronics.controller('LoginControllers', function($scope, $timeout,
AccountService,$rootScope, Loader,$state,$ionicModal, $localstorage) {
    $scope.data = {};
    
    if(localStorage.isMaintainPhase === undefined){
        $rootScope.isMaintain = localStorage.isMaintainPhase = false;
        $state.reload();
    }
    $ionicModal.fromTemplateUrl('templates/cashOutModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal_cashOut = modal;
    });

    $scope.login = function(data) {
        $scope.data={
            username:data.username,
            user_password:data.password
        }
        var data=$rootScope.formatInputString($scope.data);
        Loader.showLoading();

        AccountService.login(data)
        .then(function (result) {
             if(result.userInfo.status===0){
                
                  Loader.hide(result.userInfo.message);
             }else{
                
                $scope.userInfo = result;
                
                Loader.hideLoading();
               
                $rootScope.userId = result.userInfo.result[0].user_id;
                localStorage.setItem('campaignCompleteOrNot',$rootScope.userId);
                if($localstorage.get('signup')){
                     $localstorage.remove('signup');
                }
                if(result.userInfo.result.campaign.length>0){
                    var campaign_id=result.userInfo.result.campaign[0].campaign_id;
                    localStorage.setItem('campaign_id',campaign_id);
                }

                // console.clear();
                // console.log(result.userInfo);
                // result.userInfo.result.wallet = 0;

                if(parseInt(result.userInfo.result[0].wallet) === 0){
//                    Loader.hideLoading();
                    $scope.modal_cashOut.show();
                    

                    $timeout(function(){
                        $scope.modal_cashOut.hide();
                    },10000);
                }

                if($rootScope.previousState === 'campaignBrowse'){
                    $state.go('campaignBrowse');
                }else if($rootScope.previousState === 'account_settings'){
                     $state.go('account_settings');
                }else{
                    $state.go('globalChat');
                }
             }
            
        }, function (error) {
            Loader.hide(error.message);
        });
    }
    
});

