futronics.controller('accountSettingsCtrl',
    function($scope,StorageService,$ionicPopup,$rootScope,
    AccountService,Loader,$state,$localstorage,endcampaign,
    TimeAndDateFactory,HideCampaign,MaintainService,ShowCampaign){
     /* ******************** UserId from LocalStorage start***********************  */
    
      $scope.isMaintainPhase = localStorage.isMaintainPhase;
      $scope.isMaintainPhaseButton = localStorage.isMaintainPhaseButton;
    
    StorageService.storage();

    $scope.endCampaignStatus = $rootScope.endCampaignStatus;
    
    if($rootScope.campaign_status == 2){
        $scope.hide = 2;
    }
    if($rootScope.campaign_status == 1){
        $scope.show = 1;
    }
    
    $scope.viewStats = function(){
        if(!$rootScope.userId || $rootScope.userId==undefined){
                    $ionicPopup.show({
                        template: 'Please Login to view your stats',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                        type: 'button-calm',
                            onTap: function(e) {
                              StorageService.storage();
                              $state.go('login');
                                  return;

                          }
                        }
                    ]
                });  
            }else{
                $state.go('profileViewStats');
            }
       
    };
    if(localStorage.getItem('campaign_duration')!==null){
        $scope.campaign_duration=localStorage.getItem('campaign_duration');
    }else{
        $scope.campaign_duration=0;
    }
    $scope.campaign_id=localStorage.getItem('campaign_id');
    /* ******************** UserId from LocalStorage end***********************  */
    $scope.end_campaign=function(){
        console.clear()
        console.log($rootScope.campaign_status)
        if(!$rootScope.userId || $rootScope.userId==undefined){
        
            $ionicPopup.show({
                    template: 'Please Login to participate in campaign',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                        onTap: function(e) {
                          StorageService.storage();
                          $state.go("login");
                              return;

                      }
                    }
                ]
            });  
        }else if($rootScope.campaign_status == 0){
            $ionicPopup.show({
                    template: 'Your campaign already ended',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                        onTap: function(e) {
                          return;
                      }
                    }
                ]
            });
        }else{
            $ionicPopup.show({
            template: 'IF YOU END YOUR CAMPAIGN,you will be penalized 5% from Diet Money,and if your \n\
            campaign was already funded,the Contributors will be paid out ',
            title: '<p style="color:black"><b>End Campaign</b></p>',
            scope: $scope,
            buttons: [
              { text: 'No' ,
                type: 'button-dark'},  
              { text: 'Yes' ,
              type: 'button-calm',
             
                    onTap: function(e) {
                    if($rootScope.user.userInfo.result.campaign.length==0){
                         $ionicPopup.show({
                                template: 'You have no campaign active right now',
                                title: '<p style="color:black"><b>Attention!!!</b></p>',
                                scope: $scope,
                                buttons: [
                                { text: 'Ok' ,
                                type: 'button-calm',
                                    onTap: function(e) {
                                      return;

                                  }
                                }
                            ]
                        });
                    } else {
                     
                   Loader.showLoading();
                    if($rootScope.isMaintain == 'false'){
                        var data={
                            campain_start_date: $rootScope.campaign_date[0],
                            campain_close_requested_day_date:TimeAndDateFactory.getTodayDate(),
                            user_id:$rootScope.userId,
                            campaign_id:$scope.campaign_id
                        }; 
                    } else {
                       if(localStorage.getItem('maintainStartDate'))
                                var maintain_start_date = localStorage.getItem('maintainStartDate');
                        
                            if(localStorage.getItem('maintainId'))
                                var maintainId = localStorage.getItem('maintainId');
                            var data={
                                maintence_start_date: maintain_start_date,
                                maintence_close_requested_day_date:TimeAndDateFactory.getTodayDate(),
                                user_id:$rootScope.userId,
                                maintence_id:maintainId
                            }; 
                    }
                    var data=$rootScope.formatInputString(data);
                     Loader.hideLoading();
                    
                    endcampaign.userEndCampaign(data).then(function(response){
                        
                if(response.data.status==0){
                       
                    localStorage.setItem('showGlobalChat_afterEndCampaign','_1');
                    localStorage.removeItem('campaignCompleteOrNot');
                    localStorage.setItem('endcampaign',"success");

                    $ionicPopup.show({
                        template: 'You successfully end your campaign',
                        title: '<p style="color:black"><b></b></p>',
                        scope: $scope,
                        buttons: [{ 
                            text: 'Ok' ,
                            type: 'button-calm',
                            onTap: function(e) {
                                if(localStorage.isMaintainPhase == 'true'){
                                    localStorage.isMaintainPhase = false;
                                    localStorage.isMaintainPhaseButton = false;
                                }
                                $state.go('endCampaignProfile');
                                return;
                            }
                     }]
            });  
                
            }else{
                $ionicPopup.show({
                        template: 'Something went wrong.Try again',
                        title: '<p style="color:black"><b>Sorry!!!</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                        type: 'button-calm'
                            
                        }
                    ]
                });  
            }
                        /*** maintainance phase */
//                        if(response.data.campaign_status==="0"){
//                        if(!$rootScope.goal){
//                            $rootScope.goal=0;
//                        }
//                        if(!$rootScope.currentWeight){
//                            $rootScope.currentWeight=0;
//                        }
//        var data={
//            user_id:$rootScope.user_id,
//            proposed_maintain_weight: $rootScope.goal,
//            current_weight:$rootScope.currentWeight,
//            weight_loss_phase_campaign_id: $rootScope.runningCampaign_id
//        };
//        var data=$rootScope.formatInputString(data);
//        MaintainService.maintainPhase(data).then(function(response){
//            console.log(response);
//            if(response.data.status==1 || response.data.status=="You have now successfully registered to campaign maintence."){
//                $ionicPopup.show({
//                    template: 'You are now in Maintainance Phase.Keep maintaining',
//                    title: '<p style="color:black"><b>Congrats!!!</b></p>',
//                    scope: $scope,
//                    buttons: [
//                    { text: 'Ok' ,
//                    type: 'button-calm',
//                        onTap: function(e) {
//                        localStorage.setItem('maintainId',response.data.result.maintenance_id);
//                        $state.go('endCampaignProfile');
//                        localStorage.isMaintainPhase = true;
//                              return;
//
//                      }
//                    }
//                ]
//            });  
//                
//        }else{
//              $ionicPopup.show({
//                    template: 'Something went wrong.Try again',
//                    title: '<p style="color:black"><b>Sorry!!!</b></p>',
//                    scope: $scope,
//                    buttons: [
//                    { text: 'Ok' ,
//                    type: 'button-calm'
//                        
//                    }
//                ]
//            });  
//        }
//    });
//     
//                        }
    /** maintainance phase */
                       
                    });
                }
                   
                   //$state.go('account_settings_end_cnf_campaign');
                        return;
                    }
              }

            ]

            }); 
        }
        
    }
    /* *********************** News Feed Toggle Start******************************* */
    
   
    if($localstorage.get('newsFeed')){
       if($localstorage.get('newsFeed')==0){
            $rootScope.showDivider = $scope.newsOn=0;
            $scope.newsOff=0;
        }else{
            $scope.newsOff=1;
            $scope.newsOn=1;
        }
    }else{
      $scope.newsOff='0'; 
    }
    
    if($localstorage.get('hideShowCampaign')){
        if($localstorage.get('hideShowCampaign')==0){
            $scope.C_hide=0;
            $scope.C_show=0;
        }else{
            $scope.C_hide=1;
            $scope.C_show=1;
        }
    }else{
      $scope.C_hide='0'; 
    }
    $scope.newsFeed=function(data){
        $rootScope.showDivider = data;
        if(data==1){
            $localstorage.set('newsFeed',0);
            $scope.newsOff=0;
            $scope.newsOn=0;
        }else{
            $localstorage.set('newsFeed',1);
            $scope.newsOn=1;
            $scope.newsOff=1;
        }
    }
   /* *********************** News Feed Toggle End******************************* */
   
   
   /* ************************ HIDE CAMPAIGN START************************************ */
    $scope.hideCampaign=function(v){
       
        $scope.user1=JSON.parse(localStorage.getItem('userInfo'));
            if(!$rootScope.userId || $rootScope.userId==undefined){
                $ionicPopup.show({
                    template: 'Please Login to participate in campaign',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                        onTap: function(e) {
                          StorageService.storage();
                          $state.go("login");
                              return;

                      }
                    }
                ]
            });  
        }else if($scope.user1.userInfo.result.campaign[0].campaign_status==2){
             Loader.showLoading();
            if($rootScope.user.userInfo.result.campaign.length==0){
                         $ionicPopup.show({
                                template: 'You have no campaign active right now',
                                title: '<p style="color:black"><b>Attention!!!</b></p>',
                                scope: $scope,
                                buttons: [
                                { text: 'Ok' ,
                                type: 'button-calm',
                                    onTap: function(e) {
                                      return;

                                  }
                                }
                            ]
                        });
                    } else {
                         if($rootScope.isMaintain == 'false'){
                            var data={
                                campain_start_date: $rootScope.campaign_date[0],
                                campain_show_requested_day_date:TimeAndDateFactory.getTodayDate(),
                                user_id:$rootScope.userId,
                                campaign_id:$scope.campaign_id
                            }; 
                        }else {
                          
                            if(localStorage.getItem('maintainStartDate'))
                                var maintain_start_date = localStorage.getItem('maintainStartDate');
                        
                            if(localStorage.getItem('maintainId'))
                                var maintainId = localStorage.getItem('maintainId');
                            var data={
                                maintence_start_date: maintain_start_date,
                                maintence_show_requested_day_date:TimeAndDateFactory.getTodayDate(),
                                user_id:$rootScope.userId,
                                maintence_id:maintainId
                            }; 
                        }
                    var data=$rootScope.formatInputString(data);
                    ShowCampaign.userShowCampaign(data).then(function(response){
                        console.log('show');
                        console.log(response);
                         Loader.hideLoading();
                       if(response.data.campaign_status=="1"){
                                    $ionicPopup.show({
                                    template: 'Your campaign is shown now',
                                    title: '<p style="color:black"><b>Hide Campaign</b></p>',
                                    scope: $scope,
                                    buttons: [
                                    { text: 'Ok' ,
                                    type: 'button-calm'

                                    }
                                ]
                           });
                        }
                        if(v==1){
                            $localstorage.set('hideShowCampaign',0);
                            $scope.C_hide=0;
                            $scope.C_show=0;
                        }else{
                            $localstorage.set('hideShowCampaign',1);
                            $scope.C_hide=1;
                            $scope.C_show=1;
                        }
                    });
                   
                }
            
        }else if($scope.user1.userInfo.result.campaign[0].campaign_status==0){
            $ionicPopup.show({
                    template: 'Your campaign already ended',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                        onTap: function(e) {
                          return;

                      }
                    }
                ]
            });
        }
        else{
            $ionicPopup.show({
            template: "If you hide your campaign, it will stay active, but people won't be able to see it or contribute to it yet.  If you are funded and the campaign is running, the users won't be able to leave you comments.  But, will be able to see your progress through your video uploads. ",
            title: '<p style="color:black"><b>Hide Campaign</b></p>',
           // subTitle: 'Please enter your weight using a point to indicate decimals',
            scope: $scope,
            buttons: [
              { text: 'No' ,
                type: 'button-dark'},  
              { text: 'Yes' ,
              type: 'button-calm',

              onTap: function() {
                 
                    if($scope.user1.userInfo.result.campaign.length==0){
                         $ionicPopup.show({
                                template: 'You have no campaign active right now',
                                title: '<p style="color:black"><b>Attention!!!</b></p>',
                                scope: $scope,
                                buttons: [
                                { text: 'Ok' ,
                                type: 'button-calm',
                                    onTap: function(e) {
                                      return;

                                  }
                                }
                            ]
                        });
                    } else {
                         Loader.showLoading();
                            if($rootScope.isMaintain == 'false'){
                                var data={
                                    campain_start_date: $rootScope.campaign_date[0],
                                    campain_hide_requested_day_date:TimeAndDateFactory.getTodayDate(),
                                    user_id:$rootScope.userId,
                                    campaign_id:$scope.campaign_id
                                }; 
                            } else {
                                if(localStorage.getItem('maintainStartDate'))
                                    var maintain_start_date = localStorage.getItem('maintainStartDate');
                        
                                if(localStorage.getItem('maintainId'))
                                    var maintainId = localStorage.getItem('maintainId');
                                var data={
                                    maintence_start_date: maintain_start_date,
                                    maintence_hide_requested_day_date:TimeAndDateFactory.getTodayDate(),
                                    user_id:$rootScope.userId,
                                    maintence_id:maintainId
                                }; 
                            }
                    var data=$rootScope.formatInputString(data);
                    HideCampaign.userHideCampaign(data).then(function(response){
                        console.log('hide');
                        console.log(response);
                          Loader.hideLoading();
                       if(response.data.message=="Your campaign hide successfully."){
                                    $ionicPopup.show({
                                    template: 'Your campaign is hidden',
                                    title: '<p style="color:black"><b>Hide Campaign</b></p>',
                                    scope: $scope,
                                    buttons: [
                                    { text: 'Ok' ,
                                    type: 'button-calm'

                                    }
                                ]
                           });
                        }
                        if(v==1){
                            $localstorage.set('hideShowCampaign',0);
                            $scope.C_hide=0;
                            $scope.C_show=0;
                        }else{
                            $localstorage.set('hideShowCampaign',1);
                            $scope.C_hide=1;
                            $scope.C_show=1;
                        }
                    });
                   
                        }
                        return;
                    }
              }

            ]

            }); 
        }
    }
    
   /* ************************ HIDE CAMPAIGN END************************************ */ 

   $scope.wouldUWantToStartCampaign = function(){
        $ionicPopup.show({
            template: 'Would you like to restart a campaign now?',
            title: '<p style="color:black"><b>Your campaign already ended</b></p>',
            scope: $scope,
            buttons: [{ 
                text: 'Back' ,
                type: 'button-dark',
                onTap: function(e) {
                    return;
                }
            },{ 
                text: 'Ok' ,
                type: 'button-calm',
                onTap: function(e) {
                    startNewCampaign();
                    return;
                }
            }]
        });
   }

    function startNewCampaign(){
        $scope.slider = {
            value: 0,
            options:{
                floor: 0,ceil: 1000,step: 5,
                translate: function(value) {return '&dollar;' + value;},
                id: 'slideEnded',
                onEnd: $scope.myEndListener
            }
        };
        $ionicPopup.show({
            template: '<rzslider rz-slider-model="slider.value" rz-slider-on-click="getSliderVal()" rz-slider-options="slider.options"></rzslider>',
            title: '<p style="color:black"><b>What amount motivates you?</b></p>',
            scope: $scope,
                buttons: [
                    { text: 'Cancel' ,
                      type: 'button-dark'
                    },{
                      text: '<b>Save</b>',
                      type: 'button-calm',
                      onTap: function(e) {
                        localStorage.setItem('startnew','active');
                        console.log($scope.slider.value)
                            $state.go("signup",{motivationAmount : $scope.slider.value});
                            return;
                            }
                     }
                  ]

        });
        
    }
});