
futronics.controller('globalChatControllers', function($scope,$ionicHistory,
    stateFactory,StorageService,check_GlobalCommunity,UserListService,$q, 
    $window,AccountService, $localstorage,$rootScope,$ionicPopup,ionPullUpFooterState,
    Loader, $timeout,$state,LogoutService,newsFeedServices,$ionicSlideBoxDelegate,$firebaseArray,
    GlobalChatService,WeightLoseSuccessOrFail,MaintainService,$filter,$interval) {
      
$scope.newshow=1;
$scope.newsFeeds=[];
($rootScope.showDivider === undefined) ? $scope.showDivider = false : $scope.showDivider = !($rootScope.showDivider);
$scope.myVar = 'hideIt';
$scope.messages = '';

var newMessageArray = [];
var muteUserIdList = $localstorage.getObject('muteChatUser');
var count = 0;

/* Firebase setup */
var ref = firebase.database().ref().child("chat").child("global");
var msgRef = $firebaseArray(ref);

$scope.messages = $firebaseArray(ref);

// create a synchronized array

// ref.once('child_removed', function(snapshot) {
//     $scope.$apply()
// });

$scope.itemOnLongPress = function() {
    $scope.myVar = 'showIt'
    console.log('Long press');
}

$scope.itemOnTouchEnd = function() {

    $timeout(function() {
        $scope.myVar = 'hideIt';
    },7000);

    console.log('Touch end');
}

if(localStorage.getItem('userInfo')){
        var userInfo = JSON.parse(localStorage.getItem('userInfo')).userInfo;

     if(userInfo.status != 0){

        
        var loggedinUserId = userInfo.result[0].user_id;

       

            $scope.giveCalory = function(){
                var dataJson = {
                    user_who_provide_calories : loggedinUserId,
                    user_who_receive_calories : $scope.muteUserId,
                    calories_amount : 20
                };

                GlobalChatService.giveCalory($rootScope.formatInputString(dataJson)).then(function(res){
                    console.log("Give Calory");
                    console.log(res);
                });

            }


    $scope.muteUser = function(){
        var msg = parseInt($scope.muteUserId);
        var mutedListArray = [];
        if((mutedListArray.length === 0  || mutedListArray ) && (!$localstorage.getObject('muteChatUser'))){
                mutedListArray.push(msg);
                $localstorage.setObject('muteChatUser',mutedListArray);
        }else{
            mutedListArray = $localstorage.getObject('muteChatUser');
            if(mutedListArray.indexOf(msg) === -1){
                mutedListArray.push(msg);
                $localstorage.setObject('muteChatUser',mutedListArray);
            }
        }
    }

    $scope.addFriend = function(){
        var dataJson = {
            user_who_added_friend : loggedinUserId,
            user_who_is_added : $scope.muteUserId
        };
        GlobalChatService.addFriend($rootScope.formatInputString(dataJson)).then(function(res){
            console.log("Add Friend");
            console.log(res);
        });
        
    }

    $scope.reportUser = function(){
        var dataJson = {
            user_who_report : loggedinUserId,
            user_who_is_reported : $scope.muteUserId
        }

        GlobalChatService.reportUser($rootScope.formatInputString(dataJson)).then(function(res){
            console.log("Report user");
            console.log(res);
        });

    }

    $scope.setChatUser = function (id) {
        $scope.muteUserId = id;
    };
    }
}

newsFeedServices.news().then(function(response){
    $timeout(function(){
    for(var i=0;i<response.data.result.length;i++){
       
            $scope.newsFeeds.push(response.data.result[i]);
            $ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.loop(true);
    }
    }, 1000);
});

$scope.newsfeed=function(link){
    window.open('http://'+link,'_system','location=yes');
};
var showNews=$localstorage.get('newsFeed');
if(showNews==1){
    $scope.newshow=0;
}else{
    $scope.newshow=1;
}

// if($rootScope.userId == '' || $rootScope.userId === undefined){
//     document.getElementById('view_all').style.display = 'none';
// }

$rootScope.slidingAmount=0;
$scope.steps =5;
$scope.floorValue =0;

$rootScope.slider = {
    value: 0,
    options: {
        floor: $scope.floorValue,
        ceil: 1000,
        step: $scope.steps,
        translate: function(value) {
            return '&dollar;' + value;
            },
        id: 'slideEnded',    
        onEnd: $scope.myEndListener,
        value:0
    }
};
            

  $scope.signUp = function() {

    if( !localStorage.getItem('isMaintainPhaseButton')){
        localStorage.setItem('isMaintainPhaseButton',false);
    }
    $ionicPopup.show({
    template: '<rzslider rz-slider-model="slider.value"    rz-slider-on-click="getSliderVal()" rz-slider-options="slider.options"></rzslider>',
    title: '<p style="color:black"><b>What amount motivates you?</b></p>',
   // subTitle: 'Please enter your weight using a point to indicate decimals',
    scope: $scope,
        buttons: [
            
            { text: 'Cancel' ,
            type: 'button-dark'},
            {
              text: '<b>Save</b>',
              type: 'button-calm',
              onTap: function(e) {
                $state.go("signup",{ motivationAmount : $rootScope.slideValue });
                return;
              }
             }
          ]

    });
  


  };
        $scope.onFooterExpand = function() {
           //console.log('Footer expanded');
        };
        $scope.onFooterCollapse = function() {
            //console.log('Footer collapsed');
        };

        $scope.expand = function() {
          $scope.footerState = ionPullUpFooterState.EXPANDED;  
        };
       
    $scope.$on("slideEnded", function() {
      $rootScope.slidingAmount= $scope.slider.value;
      $rootScope.slideValue = $scope.slider.value;
    });
    
      $scope.check=0;
      $scope.userdata='';
      
       $scope.userdata=AccountService.getUserInfo();
       //console.log($scope.userdata);
       if($scope.userdata==undefined){
          $scope.check=0;
       }else{
          $scope.check=$scope.userdata.userInfo.status;
       }
       //$scope.check=$scope.userdata.userInfo.status;
     
     /*****************************Logout*************************************/
     
     $scope.logout=function(){
        
      LogoutService.logout();
     };
     /********LoadMore() ******USERINFO*****method---ion-infinite-scroll********/
     

    StorageService.storage();
    if($rootScope.user_id =='' || $rootScope.user_id == undefined){
        $scope.show_gear = 0;
    } else{
        $scope.show_gear = 1;
    }
    $scope.checkMember=function(){
        $scope.$broadcast('scroll');
        check_GlobalCommunity.check_memberOrNot();
    };

       /* **************** Fetch USERINFO FROM LOCALSTORAGE************************************* */ 

      /* ***************** Fetch USERINFO FROM LOCALSTORAGE************************************ */ 
    
    $scope.noMoreItemsAvailable = false;
    $scope.pageValue=1;
    $scope.userListShowbeforeLogin=[];
    var data={
            page:$scope.pageValue
    };
    var data=$rootScope.formatInputString(data);
    
    if($rootScope.previousState==='login' || $rootScope.previousState===''){
    // Loader.showLoading();
    if( !localStorage.getItem('isMaintainPhaseButton')){
        localStorage.setItem('isMaintainPhaseButton',false);
    }
    var countNosOfStatusOne = 0;
    UserListService.userListOnLoad(data)
                       .then(function(res){

        $localstorage.set('allUserDetails',JSON.stringify(res.data.result));      
            if(res.data.result.length!==0){
            for(var i=0;i<res.data.result.length;i++){
                //   if(res.data.result[i].campaign.length>0 && res.data.result[i].profile_videos.length>0){ 
                //        if(res.data.result[i].campaign[0].campaign_status==="1"){
                //             count = 1;
                //             if(++countNosOfStatusOne <= 20){
                //                 $scope.loadMore();
                //             }
                //             if($rootScope.user_id != res.data.result[i].user_details.user_id) {
                //                 $scope.userListShowbeforeLogin.push(res.data.result[i]);
                //             }
                //        }
                //     }
                if(res.data.result[i].campaign.length > 0){ 
                       if(res.data.result[i].campaign[0].campaign_status==="1"){
                            count = 1;
                            if(++countNosOfStatusOne <= 20){
                                $scope.loadMore();
                            }
                            if($rootScope.user_id != res.data.result[i].user_details.user_id) {
                                $scope.userListShowbeforeLogin.push(res.data.result[i]);
                            }
                       }
                    }
                }
                if(count == 0) {
                    $scope.loadMore();
                }
            }
               Loader.hideLoading();
        });
    }else{
        var all_user_details=JSON.parse($localstorage.get('allUserDetails'));
        var userlistlength=Math.ceil(all_user_details.length/20);
        $scope.pageValue=userlistlength;
        for(var i=0;i<all_user_details.length;i++){
            //  if(all_user_details[i].campaign.length>0 && all_user_details[i].profile_videos.length>0){
            //         if(all_user_details[i].campaign[0].campaign_status==="1"){ 
            //             $scope.userListShowbeforeLogin.push(all_user_details[i]);
            //    }
            // }
            if(all_user_details[i].campaign.length > 0){     
                if(all_user_details[i].campaign[0].campaign_status==="1"){ 
                   $scope.userListShowbeforeLogin.push(all_user_details[i]);
                }
            }
        }
    }
  
 
        var allCorrectDetails = [];
        $scope.loadMore = function() {
            // Loader.showLoading();
            $scope.pageValue+=1;
            var data={
                     page:$scope.pageValue
            };
            
            var data=$rootScope.formatInputString(data);

            UserListService.userListOnLoad(data).then(function(res){
               var all_details =  $localstorage.getObject('allUserDetails');
               

                for(var i=0;i<res.data.result.length;i++){
                    // if(res.data.result[i].campaign.length>0 && res.data.result[i].profile_videos.length>0){ 
                    //   if(res.data.result[i].campaign[0].campaign_status=='1'){
                    //      if($rootScope.user_id != res.data.result[i].user_details.user_id) {
                    //         for(var j=0;j<$scope.userListShowbeforeLogin.length;j++){
                    //             allCorrectDetails.push($scope.userListShowbeforeLogin[j].user_details.user_id)
                    //         }
                    //         if(allCorrectDetails.indexOf(res.data.result[i].user_details.user_id) == -1)
                    //         $scope.userListShowbeforeLogin.push(res.data.result[i]);
                    //     }
                    //   }
                    // } 

                    if(res.data.result[i].campaign.length > 0){ 
                      if(res.data.result[i].campaign[0].campaign_status=='1'){
                         if($rootScope.user_id != res.data.result[i].user_details.user_id) {
                            for(var j=0;j<$scope.userListShowbeforeLogin.length;j++){
                                allCorrectDetails.push($scope.userListShowbeforeLogin[j].user_details.user_id)
                            }
                            if(allCorrectDetails.indexOf(res.data.result[i].user_details.user_id) == -1)
                            $scope.userListShowbeforeLogin.push(res.data.result[i]);
                        }
                      }
                    } 

                }
              
              $localstorage.set('allUserDetails',JSON.stringify($scope.userListShowbeforeLogin)); 
              Loader.hideLoading();
            });
         };
       
        $scope.userprofile=function(userdata){
            console.clear()
            console.log('userdata');
            console.log(userdata);
            var otheruserId = userdata.user_details.user_id ;
           
            var otherUser_campaignId = userdata.campaign[0].campaign_id;
            localStorage.setItem('otherUserCampaignId',otherUser_campaignId);
            var id=userdata.user_details.user_id;
           
            localStorage.setItem('otherProfileDetails',id);
            if($rootScope.user_id!=id){
                localStorage.removeItem('myProfile');
            }else{
                 localStorage.setItem('myProfile','1');
            }
            localStorage.setItem('viewIndividualProfile_globalChat',JSON.stringify(userdata));
            $state.go('profile',{id:otheruserId});
        };
      
      $scope.myOwnProfile=function(){
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
      }
      if(localStorage.getItem('userInfo')==null || localStorage.getItem('userInfo')==''){
            $scope.check=0;
            $scope.check1=1;
            return false;
      } else {      
        var userInfo = JSON.parse(localStorage.getItem('userInfo')).userInfo;

        /**
        * Firebase adding functionlity
        */
        
        $scope.addMessage = function(msg) {
            if(msg){
                var myChatObj = {
                    id : userInfo.result[0].user_id,
                    user_image : (userInfo.result.profile_videos.length == 0 || userInfo.result.profile_videos === undefined || userInfo.result.profile_videos === '') ? '' : userInfo.result.profile_videos[0].thumb_url,
                    text: $scope.campaign_text || msg,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                };

                msgRef.$add(myChatObj);
                // $scope.messages.push(myChatObj);
                $scope.campaign_text = '';
                $scope.$broadcast('scroll');
            }
        };
    }

    $scope.goToChatPage = function(){
        $state.go('chat');
    }

    if($rootScope.user_id != null && $rootScope.user_id != '' && $rootScope.user_id != undefined){
       
        $rootScope.isMaintain = localStorage.getItem('isMaintainPhaseButton');

        if($rootScope.isMaintain == "false") {
            
            if($rootScope.currentState === "globalChat"){
            var data = {
                user_id : $rootScope.user_id,
                campaign_id : $rootScope.user.userInfo.result.campaign[0]['campaign_id']
            };
            var data = $rootScope.formatInputString(data);
                WeightLoseSuccessOrFail.SuccessOrFail(data).then(function(response){
                     $scope.sliderMain = {
                        value: 90,
                        options: {
                            floor: 90,
                            ceil: 365,
                            step: 1,
                            translate: function(value) {
                                return value;
                                },
                            id: 'slideEndedMain',    
                            onEnd: $scope.myEndListener
                        }
                    };

                    if(response.data.result.campaign_full_setup_or_not == 'false' && response.data.result.campaign_success_or_fail == 'Fail'){
                        $rootScope.endCampaignStatus = response.data.result.campaign_full_setup_or_not;
                    }else{
                        $rootScope.endCampaignStatus = response.data.result.campaign_full_setup_or_not;
                    }
                
                    if(localStorage.getItem('ShowAlertForMaintenancePhase') == null && response.data.result.campaign_full_setup_or_not == 'true' && response.data.result.campaign_success_or_fail == 'Success') {
                        $ionicPopup.show({
                            template: 'Are you want to start maintenance phase',
                            title: '<p style="color:black"><b>Attention!!!</b></p>',
                            buttons: [
                                { 
                                    text: 'Ok' ,
                                    type: 'button-calm',
                                    onTap: function(e) { 

                                        $ionicPopup.show({
                                            template: '<rzslider rz-slider-model="sliderMain.value" rz-slider-on-click="getSliderVal()" rz-slider-options="sliderMain.options"></rzslider>',
                                            title: '<p style="color:black"><b>What is your maintainence duration?</b></p>',
                                            scope: $scope,
                                            buttons: [{
                                                    text: '<b>Save</b>',
                                                    type: 'button-calm',
                                                    onTap: function(e) {

                                                        var data={
                                                            user_id:$rootScope.user_id,
                                                            proposed_maintain_weight: $rootScope.goal,
                                                            current_weight:$rootScope.currentWeight,
                                                            weight_loss_phase_campaign_id: $rootScope.runningCampaign_id,
                                                            maintenance_duration : $scope.sliderMain.value
                                                        };

                                                        MaintainService.maintainPhase($rootScope.formatInputString(data))
                                                            .then(function(response){
                                                                localStorage.setItem('maintainId',response.data.result.maintenance_id);
                                                                var date = $filter('date')(new Date(),'yyyy-MM-dd');
                                                                localStorage.setItem('maintainStartDate',date);
                                                                localStorage.setItem('isMaintainPhaseButton',true);
                                                                localStorage.setItem('isMaintainPhase',true);
                                                                $rootScope.isMaintain = true;
                                                                $state.reload();    
                                                            });
                                                        return;
                                                    }
                                                }]
                                        });
                                        return; 
                                    }
                                },{ 
                                    text: 'Cancel' ,
                                    type: 'button-dark',
                                    onTap: function(e) { return; }
                                }
                            ]
                        });
                        localStorage.setItem('ShowAlertForMaintenancePhase',1);
                    }

                });
            }
        
        }
    }

    $scope.check_campaignId = function(){
        if(localStorage.getItem('campaign_id') == null && localStorage.getItem('campaign_id') == '' && localStorage.getItem('campaign_id') == undefined) {
             toastr.error('Sorry!!You have no active campaign');
             return false;
        } 
    };
    
    // $interval(function(){
    //     var now = Date.now();
    //     var cutoff = now - (1 * 60 * 1000);
    //     ref.on('value', function(snapshot) {
    //         if(snapshot.val() !== null){
    //             snapshot.forEach(function(childSnapshort){
    //                 if(childSnapshort.val().createdAt < cutoff){
    //                     snapshot.ref.remove();
    //                 } 
    //             });  
    //         }
    //     });
    // },1000);

});


