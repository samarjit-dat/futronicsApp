futronics.service("LocalStorageRemoveService", 
    function($localstorage,$ionicPopup,StorageService,$state,$rootScope) {
        this.storageRemove = function(){
            $localstorage.remove('otherProfileDetails');
            $localstorage.remove('otherUserCampaignId');
            $localstorage.remove('isMaintainPhase');
            $localstorage.remove('campaignCompleteOrNot');
            $localstorage.remove('campaign_id');
            $localstorage.remove('ShowAlertForMaintenancePhase');
            $localstorage.remove('newsFeed');
            $localstorage.remove('hideShowCampaign');
            $localstorage.remove('myProfile');
            $localstorage.remove('viewIndividualProfile_globalChat');
            
        };
   });

futronics.service("LogoutService", 
    function($localstorage,$ionicPopup,StorageService,
    LocalStorageRemoveService,$state,$rootScope) {
        this.logout=function(){
       
        // Loader.showLoading();
            var userInfo = null;
            var buttonType = 'button-calm';

            if($rootScope.isMaintain == 'true'){
               buttonType = 'button-calm gold-bg'     
            }

            $localstorage.remove('userInfo');
            if(userInfo=="" || userInfo==null){
               $ionicPopup.show({
                    template: 'You successfully logged out',
                    title: '<p style="color:black"><b>Logout</b></p>',
                   // scope: $scope,
                    buttons: [
                    { text: 'Cancel' ,
                    type: 'button-dark'},    
                    { text: 'Ok' ,
                    type: buttonType,
                      onTap: function(e) {
                              StorageService.storage(); 
                              LocalStorageRemoveService.storageRemove();
                              $state.go('login');
                              return;
                        }
                    }

                ]
            });  
       }
   }; 
});




