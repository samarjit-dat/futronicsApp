futronics.controller('ProfileCtrl',
    function($scope,$rootScope,AccountService,UserListService,check_GlobalCommunity,
    $ionicHistory,StorageService,$ionicModal,$sce,$http,$state,
    $window,$localstorage,$ionicPopup,URL,$location,IMAGE,stateFactory,LogoutService,
    FakeVideoService,GoodVideoService,FakevideoReportList,$firebaseArray,$stateParams,
    CaloryHaveOrGiven) {
    
  
    var privateMsgSetupFlag = 0;

    /**
    * Firebase setup
    */
    var ref = firebase.database().ref().child("chat").child("private");
    var msgRef = $firebaseArray(ref);
    $scope.messages = $firebaseArray(ref);

    var myTitleJSon=JSON.parse(localStorage.getItem('userInfo'));
    $scope.video_countdown = '';
    
    if(localStorage.getItem('video_countdown')){
        $scope.video_countdown = localStorage.getItem('video_countdown');
        console.log($scope.video_countdown);
    }
    
    if(localStorage.getItem('endcampaign',"success") === 'success'){
        $scope.endCampaignStatus = 0;
    }
    
    if(myTitleJSon === null){
        $scope.myTitle = '';
    }else{
        $scope.myTitle = myTitleJSon.userInfo.result[0].username;
    }

    $scope.fakelist = [];
    
    /* ************************* Show User List Start************************************************ */
    $ionicModal.fromTemplateUrl('videoModalScript.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal_video = modal;
    });

    StorageService.storage();
    if( localStorage.getItem('hideuploadpage')) {
        $scope.hideOption = localStorage.getItem('hideuploadpage');
        $scope.unCompleteCampaign =0;
    }

    if( localStorage.getItem("refrstate")) { 
        $scope.referStae =  localStorage.getItem("refrstate");
    }
    if($rootScope.user_id =='' || $rootScope.user_id == undefined){
        $scope.show_gear = 0;
    } else{
        $scope.show_gear = 1;
    }

//    if( $scope.checkload==undefined){
//    var count=1;
//    if($rootScope.user.userInfo.result.profile_videos.length>0){
//         if(localStorage.getItem('actualState') || localStorage.getItem('currentSate')){
//             //$state.go('$state.current',{},{reload:true});
//                if(count==1){
//                   $state.reload();
//                   count++;
//                   $scope.checkload=1;
//                }
//            }
//        }
//    }


  

    $scope.uid=$rootScope.user_id;
    if(localStorage.getItem('otherProfileDetails')){
       $scope.otheruserId= localStorage.getItem('otherProfileDetails');
    }

    if(localStorage.getItem('campaignCompleteOrNot')){
        if(localStorage.getItem('userInfo')){
            if($rootScope.user.userInfo.result.profile_videos.length===0){
                $scope.completeOrNot=localStorage.getItem('campaignCompleteOrNot');
                if( localStorage.getItem('showGlobalChat_afterEndCampaign')){
                     localStorage.removeItem('showGlobalChat_afterEndCampaign');
                }
            }
        }

        if(localStorage.getItem('endcampaign')){
            $scope.completeOrNot=localStorage.getItem('campaignCompleteOrNot');
                if( localStorage.getItem('showGlobalChat_afterEndCampaign')){
                     localStorage.removeItem('showGlobalChat_afterEndCampaign');
                }
        }

    }
    if(localStorage.getItem('showGlobalChat_afterEndCampaign')){
        $scope.completeOrNot=localStorage.getItem('showGlobalChat_afterEndCampaign');
        localStorage.removeItem('campaignCompleteOrNot');
    }


     /* *************** Show User List End********************************************************** */
    /*** checking for Login or Logout state start****/

      $scope.check=0;
      $scope.userdata='';

       $scope.userdata=AccountService.getUserInfo();
       console.log($scope.userdata);
       if($scope.userdata==undefined){
          $scope.check=0;
       }else{
          $scope.check=$scope.userdata.userInfo.status;
       }
    /*** checking for Login or Logout state end****/
      //$scope.items=friends;
      $scope.user_id='';
      $scope.logout=function(){
        LogoutService.logout();
      };
      $scope.slideHasChanged = function(index) {

          //$scope.items.push("{name:'John', age:25, gender:'boy'}");
      }

    /* **************** Fetch USERINFO FROM LOCALSTORAGE End*********************************** */
    $scope.checkMember=function(){
            check_GlobalCommunity.check_memberOrNot();
    }
    /* *** username and details start *** */
    $scope.myProfile=0;
    $scope.otherProfile='';


    var imgObj = [];
    $scope.videoId = [];
    $scope.mainImage =  IMAGE.BASE_IMAGE;

     if(localStorage.getItem('viewIndividualProfile_globalChat')!=null){
         privateMsgSetupFlag = 1;
         $scope.otherProfile=1;
         $scope.myProfile=0;
         $scope.individual_user_details=JSON.parse(localStorage.getItem('viewIndividualProfile_globalChat'));

          /*******************************Image push start************************************/

        //   $scope.individual_user_details.profile_images.forEach(function(ele){
        //     var requiredParams = [];

        //     var imageStr = ele.profile_image;
        //     requiredParams['profile_image'] = imageStr;
        //     imgObj.push(requiredParams);
        //   });
            console.log($scope.individual_user_details)
          if($scope.individual_user_details.profile_videos.length > 0){
              $scope.individual_user_details.profile_videos.forEach(function(ele){

                var requiredParams = [];

                requiredParams['thumb_url'] = ele.thumb_url;
                requiredParams['video_url'] = ele.user_id;
                requiredParams['user_videos_id'] = ele.user_id;
                requiredParams['user_id'] = ele.user_id;
                requiredParams['user_whose_video_fake'] = (ele.user_whose_video_fake === undefined) ? null : ele.user_whose_video_fake;
                requiredParams['user_whose_video_good'] = (ele.user_whose_video_good === undefined) ? null : ele.user_whose_video_good;

                imgObj.push(requiredParams);
            });

            if(imgObj.length>0){
                $scope.profileImages = array_chunk(imgObj,3);

                function array_chunk(array,chunkSize){
                return [].concat.apply([],
                    array.map(function(elem,i) {
                    return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
                    })
                );
                }

                if(imgObj[0]['thumb_url']){
                    $scope.mainImage = imgObj[0]['thumb_url'];
                    $scope.videoId = imgObj[0]['user_videos_id'];
                    $scope.other_user_id = imgObj[0]['user_id'];
                }

            }else{
                $scope.mainImage =  IMAGE.BASE_IMAGE;
            }
          }

      /*******************************Image push end************************************/
     }

     /* *** username and details end *** */


     /* *****  user own profle start **** */

     if(localStorage.getItem('myProfile')!=null){
         privateMsgSetupFlag = 2;
         $scope.totalCampaign='';
         $scope.myProfile=0;
         $scope.my_details='';
         $scope.my_details = JSON.parse(localStorage.getItem('userInfo'));

         if($scope.my_details.userInfo.result.campaign.length!==0){
             $scope.status=$rootScope.campaign_status;
         }

        //   $scope.my_details.userInfo.result.profile_images.forEach(function(ele){
        //     var requiredParams = [];
        //     var imageStr = ele.profile_image;
        //     requiredParams['profile_image'] = imageStr;
        //     imgObj.push(requiredParams);
        //   });

          if($scope.my_details.userInfo.result.profile_videos.length > 0){
              $scope.my_details.userInfo.result.profile_videos.forEach(function(ele){

                var requiredParams = [];

                requiredParams['thumb_url'] = ele.thumb_url;
                requiredParams['video_url'] = ele.user_id;
                requiredParams['user_videos_id'] = ele.user_id;
                requiredParams['user_id'] = ele.user_id;
                requiredParams['user_whose_video_fake'] = (ele.user_whose_video_fake === undefined) ? null : ele.user_whose_video_fake;
                requiredParams['user_whose_video_good'] = (ele.user_whose_video_good === undefined) ? null : ele.user_whose_video_good;

                imgObj.push(requiredParams);
            });

            if(imgObj.length>0){

                var appBasePath = $location.absUrl();
                appBasePath = appBasePath.substring(0,appBasePath.indexOf('#'));
                $scope.mainImage = appBasePath+'img/circle.png';

                $scope.profileImages = array_chunk(imgObj,3);

                function array_chunk(array,chunkSize){
                return [].concat.apply([],
                    array.map(function(elem,i) {
                    return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
                    })
                );
                }

                if(imgObj[0]['profile_image']){
                    $scope.mainImage = imgObj[0]['profile_image'];
                }else if(imgObj[0]['thumb_url']){
                $scope.mainImage = imgObj[0]['thumb_url'];
                $scope.videoId = imgObj[0]['user_videos_id'];
                }
            }else{
                $scope.mainImage =  IMAGE.BASE_IMAGE;
            }
          }

         if($scope.my_details.userInfo.result.campaign==[]){
            $scope.totalCampaign=0;
         }


     }else{
          $scope.totalCampaign=0;
          $scope.myProfile=1;
     }
   

     if($scope.status==1){
        if(!localStorage.getItem('actualState')){
            if(localStorage.getItem('currentSate')){
                var lastState=localStorage.getItem('currentSate');
                localStorage.setItem('actualState',lastState);
            }
        }
        if(localStorage.getItem('actualState')){

            var a_state=localStorage.getItem('actualState');
            var c_state=localStorage.getItem('currentSate');

            if(c_state==='campaignBrowse'){
                  localStorage.setItem('actualState',a_state);
            }else if(c_state==='contribution'){
                  localStorage.setItem('actualState',a_state);
            }else if(c_state==='addFund'){
                  localStorage.setItem('actualState',a_state);
            }else if(c_state==='thanksAfterContribution'){
                  localStorage.setItem('actualState',a_state);
            }else if(c_state==='profile'){
                  localStorage.setItem('actualState',a_state);
            }else{
                 localStorage.setItem('actualState',c_state);
            }

           if(c_state==='endCampaignProfile'){
               localStorage.removeItem('actualState');
           }

          }
        }else{
         localStorage.removeItem('actualState');

        }
        $scope.user_list=function(){
            localStorage.setItem('statusCheck',$scope.status);
            if($scope.status==0){
                localStorage.setItem('campaignCompleteOrNot',$rootScope.user_id);
            }else{
                localStorage.setItem('campaignCompleteOrNot',$rootScope.user_id);
            }
                $state.go('campaignBrowse');
        };
    $scope.referStae = 1;
    /************************** video open on modal **************************************/
    $scope.openMainImageVideoModal = function(){

        var id,profileImagesDomEle;
        if($scope.videoId){
             id = $scope.videoId;
             profileImagesDomEle = angular.element(document.getElementById(id));
        }
        if($scope.videoId==undefined){
           id = '#profileImage';
           profileImagesDomEle = angular.element(document.querySelector(id));
        }

        $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(profileImagesDomEle[0].alt);
        if(profileImagesDomEle[0].alt!=='' && profileImagesDomEle[0].alt!=='undefined'){
            $scope.modal_video.show();
        }else{
             $scope.modal_video.hide();
        }
    };

    $scope.reportGoodVideo = function(video_id){
     $scope.video_id = video_id;
    };

    FakevideoReportList.list().then(function(response){
        for(var i=0;i<response.data.result.length;i++){
          $scope.fakelist.push(response.data.result[i]);
        }
    });

    $scope.fakeResponseList = function(listid) {
        $scope.fakeTypeId = listid;
    };

    var fakeVideo = [];
    $scope.fakeVideo = function() {
        
        if(localStorage.getItem('fakeVideo')){
            var fakeid = JSON.parse(localStorage.getItem('fakeVideo'));
            var flag_fake,good_flag;
            if(fakeid.indexOf($scope.video_id)>-1){
                 flag_fake = 1;
            }else {
                if(localStorage.getItem('goodVideo')) {
                    var goodid = JSON.parse(localStorage.getItem('goodVideo'));
                    if(goodid.indexOf($scope.video_id)>-1){
                        good_flag = 3;
                    } else {
                        flag_fake = 0;
                    }
                }else {
                     flag_fake = 0;
                }
            }
            if(flag_fake == 1){
                    $ionicPopup.show({
                        template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as fake',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                          type: 'button-calm'
                        }
                       ]
                   });
            }

            if(good_flag == 3){
                    $ionicPopup.show({
                        template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as good',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                          type: 'button-calm'
                        }
                       ]
                   });
            }
            if(flag_fake == 0) {
                $scope.fakeReport();
            }
        } else {
            if(localStorage.getItem('goodVideo')){
                var goodid = JSON.parse(localStorage.getItem('goodVideo'));
                if(goodid.indexOf($scope.video_id)>-1){
                    good_flag = 3;
                } else {
                    flag_fake = 0;
                }


           } else {
                if($scope.alreadyHit_flag = 0){
                        $ionicPopup.show({
                         template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as fake',
                         title: '<p style="color:black"><b>Report To Admin</b></p>',
                         scope: $scope,
                         buttons: [
                         { text: 'Ok' ,
                           type: 'button-calm'
                         }
                        ]
                    });
                } else {
                 flag_fake = 0;
              }
           }


                if(good_flag == 3){
                    $ionicPopup.show({
                        template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as good',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                          type: 'button-calm'
                        }
                       ]
                   });
                }
                if(flag_fake == 0) {
                    $scope.fakeReport();
                }
            }

        };

        $scope.fakeReport = function() {

        if(localStorage.getItem('otherUserCampaignId')){
            var otheruser_campaignid = localStorage.getItem('otherUserCampaignId');

            if(localStorage.getItem('userInfo')){
                if($rootScope.user.userInfo.result[0].user_id!='' || $rootScope.user.userInfo.result[0].user_id!=null){
                    if($scope.other_user_id){
                        if($scope.other_user_id!=$rootScope.user_id){
                                $ionicPopup.show({
                                    templateUrl: 'reportPopupFake.html',
                                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                                    scope: $scope,
                                    buttons: [
                                    { text: 'cancel' ,
                                    type: 'button-dark'
                                    },
                                    { text: 'Ok' ,
                                    type: 'button-calm',
                                        onTap: function(e) {
                                            if($scope.fakeTypeId){
                                                if($rootScope.isMaintain == 'false'){
                                                
                                                    var data = {
                                                        video_id: $scope.video_id,
                                                        user_who_marked_fake: $rootScope.user_id,
                                                        user_whose_video_fake: $scope.other_user_id,
                                                        campaign_id: otheruser_campaignid,
                                                        fake_reason_option_id: $scope.fakeTypeId
                                                    };
                                                } else {
                                                    if(localStorage.getItem('maintainId'))
                                                        var maintainId = localStorage.getItem('maintainId');
                                                    var data = {
                                                        maintence_video_id: $scope.video_id,
                                                        user_who_marked_fake: $rootScope.user_id,
                                                        user_whose_video_fake: $scope.other_user_id,
                                                        maintence_id: maintainId,
                                                        fake_reason_option_id: $scope.fakeTypeId
                                                    };
                                                }
                                            var data=$rootScope.formatInputString(data);
                                            FakeVideoService.fakeVideo(data).then(function(response){
                                                if(response.data.status==1){
                                                var f_id = $scope.video_id;
                                                if(!localStorage.getItem('fakeVideo')){
                                                    localStorage.setItem('fakeVideo',JSON.stringify([f_id]));
                                                }else {
                                                    fakeVideo = JSON.parse(localStorage.getItem('fakeVideo'));
                                                    fakeVideo.push(f_id);
                                                    localStorage.setItem('fakeVideo',JSON.stringify(fakeVideo));
                                                }
                                                $scope.fakeButton = $scope.video_id;
                                                $scope.goodButton = $scope.video_id;
                                                $ionicPopup.show({
                                                    template: 'Thank you for your report, '+$scope.individual_user_details.user_details.username+' will be notified to post a new video if 3 or more people report the video, and they will be informed of what to fix.',
                                                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                                                            scope: $scope,
                                                                buttons: [
                                                                { text: 'Ok' ,
                                                                    type: 'button-calm'
                                                                }
                                                            ]
                                                        });
                                                        } else {
                                                            $scope.alreadyHit_flag = 0;
                                                                    $ionicPopup.show({
                                                                        template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as fake',
                                                                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                                                                        scope: $scope,
                                                                        buttons: [
                                                                        { text: 'Ok' ,
                                                                        type: 'button-calm'
                                                                        }
                                                                    ]
                                                                });
                                                        }
                                                    });
                                                    return;
                                        }else{
                                            toastr.error('Please mention a reason before report');
                                        }
                                                }
                                            }
                                        
                                        ]
                                    });
                        }else{
                            $ionicPopup.show({
                                template: "You Can't report against you by yourself" ,
                                title: '<p style="color:black"><b>Attention!!!</b></p>',
                                scope: $scope,
                                buttons: [{ 
                                    text: 'Ok' ,
                                    type: 'button-calm',
                                }]
                            });
                        }
                    }
                }else{
                    $ionicPopup.show({
                        template: 'Please Login to report',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                        type: 'button-calm',
                            onTap: function(e) {
                            $scope.modal_video.hide();
                            $state.go("login");
                                return;

                            }
                        }
                    ]
                    });
                }
          }else{
                $ionicPopup.show({
                    template: 'Please Login to report',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                        onTap: function(e) {
                          $scope.modal_video.hide();
                          $state.go("login");
                              return;

                        }
                    }
                ]
            });
            }
       } else{
           $ionicPopup.show({
                    template: "You may try to report your own video.You can only report other user videos",
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'
                    }
                ]
            });
       }
    };
    var goodVideo = [];
    $scope.goodVideo = function() {
       if(localStorage.getItem('fakeVideo')){
            var fakeid = JSON.parse(localStorage.getItem('fakeVideo'));
            var flag_fake,good_flag;
            if(fakeid.indexOf($scope.video_id)>-1){
                 flag_fake = 1;
            }else {
                if(localStorage.getItem('goodVideo')) {
                    var goodid = JSON.parse(localStorage.getItem('goodVideo'));
                    if(goodid.indexOf($scope.video_id)>-1){
                         good_flag = 3;
                    } else {
                       good_flag = 4;
                    }
                }else{
                    good_flag = 4;
                }
            }


            if(flag_fake == 1){
                    $ionicPopup.show({
                        template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as fake',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                          type: 'button-calm'
                        }
                       ]
                   });
            }

            if(good_flag == 3){
                    $ionicPopup.show({
                        template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as good',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                          type: 'button-calm'
                        }
                       ]
                   });
            }
            if(good_flag == 4) {
                $scope.goodReport();
            }
        } else {
            if($scope.alreadyHit_flag = 0){
                        $ionicPopup.show({
                         template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as fake',
                         title: '<p style="color:black"><b>Report To Admin</b></p>',
                         scope: $scope,
                         buttons: [
                         { text: 'Ok' ,
                           type: 'button-calm'
                         }
                        ]
                    });
                } else {
                 if(localStorage.getItem('goodVideo')) {
                    var goodid = JSON.parse(localStorage.getItem('goodVideo'));

                    if(goodid.indexOf($scope.video_id)>-1){
                        good_flag = 3;
                    } else {
                        good_flag = 4;
                    }

                    if($scope.good_flag == 4) {
                       $scope.goodReport();
                    }

                    if(good_flag == 3){
                            $ionicPopup.show({
                                template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as good',
                                title: '<p style="color:black"><b>Report To Admin</b></p>',
                                scope: $scope,
                                buttons: [
                                { text: 'Ok' ,
                                  type: 'button-calm'
                                }
                               ]
                           });
                    }
                } else {
                   if($scope.alreadyHit_flag_good == 0) {
                        $ionicPopup.show({
                                template: 'You already report '+$scope.individual_user_details.user_details.username+'s video as good',
                                title: '<p style="color:black"><b>Report To Admin</b></p>',
                                scope: $scope,
                                buttons: [
                                { text: 'Ok' ,
                                  type: 'button-calm'
                                }
                               ]
                           });
                   } else {
                         $scope.goodReport();
                   }
                }
            }

    }

    };


    $scope.goodReport =function(){
        if(localStorage.getItem('otherUserCampaignId')){
            var otheruser_campaignid = localStorage.getItem('otherUserCampaignId');

            if(localStorage.getItem('userInfo')){
            if($rootScope.user.userInfo.result[0].user_id!='' || $rootScope.user.userInfo.result[0].user_id!=null){
                if($scope.other_user_id){
                    if($scope.other_user_id!=$rootScope.user_id){
                        if($scope.videoId!='profileImage'){
                            $ionicPopup.show({
                                template: 'You are about to give a “good” rating for this video, indicating that it abides by the Diet Money Policy',
                                // template: 'Are you want to report the video?',
                                title: '<p style="color:black"><b>Attention!!!</b></p>',
                                scope: $scope,
                                buttons: [
                                { text: 'cancel' ,
                                  type: 'button-dark'
                                },
                                { text: 'Ok' ,
                                type: 'button-calm',
                                    onTap: function(e) {
                                        var data = {
                                        video_id: $scope.video_id,
                                        user_whose_video_good: $scope.other_user_id,
                                        user_who_marked_good: $rootScope.user_id,
                                        campaign_id: otheruser_campaignid

                                    };
                                    var data=$rootScope.formatInputString(data);
                                    GoodVideoService.goodVideo(data).then(function(response){
                                        if(response.data.status==1){
                                            var g_id = $scope.video_id;
                                            if(!localStorage.getItem('goodVideo')){
                                                localStorage.setItem('goodVideo',JSON.stringify([g_id]));
                                            }else {
                                                goodVideo = JSON.parse(localStorage.getItem('goodVideo'));
                                                goodVideo.push(g_id);
                                                localStorage.setItem('goodVideo',JSON.stringify(goodVideo));
                                            }
                                            $ionicPopup.show({
                                                template: 'Thank you for your report, the '+$scope.individual_user_details.user_details.username+' will be benifited to get your valuable response.',
                                                    title: '<p style="color:black"><b>Report To Admin</b></p>',
                                                        scope: $scope,
                                                            buttons: [
                                                               { text: 'Ok' ,
                                                                 type: 'button-calm'
                                                               }
                                                           ]
                                                       });
                                                       }else{
                                                           $scope.alreadyHit_flag_good = 0;
                                                       }
                                                   });
                                                return;
                                            }
                                        }
                                    ]
                                });
                            }
                    }else{
                        $ionicPopup.show({
                            template: "You Can't report against you by yourself" ,
                            title: '<p style="color:black"><b>Attention!!!</b></p>',
                            scope: $scope,
                            buttons: [
                            { text: 'Ok' ,
                              type: 'button-calm',

                            }
                        ]
                    });
                    }

                }
            }else{
                $ionicPopup.show({
                    template: 'Please Login to report',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                        onTap: function(e) {
                          $scope.modal_video.hide();
                          $state.go("login");
                              return;

                        }
                    }
                ]
            });
            }
        } else{
                $ionicPopup.show({
                    template: 'Please Login to report',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                        onTap: function(e) {
                          $scope.modal_video.hide();
                          $state.go("login");
                              return;

                        }
                    }
                ]
            });
            }
        } else {
                $ionicPopup.show({
                    template: "You have no active campaign right now.So,you Can't review about the video.Are you want to start a new one?",
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'cancel' ,
                      type: 'button-dark'
                    },
                    { text: 'Ok' ,
                      type: 'button-calm',
                        onTap: function(e) {
                        $state.go("endCampaignProfile");
                        return;

                        }

                    }
                ]
            });
         }
    };

    $scope.completeCampaign = function(){
       if(localStorage.getItem('actualState')){
            var current_state=localStorage.getItem('actualState');
            $state.go(current_state);
        }else if(localStorage.getItem('currentSate')){
             var current_stat=localStorage.getItem('currentSate');
             $state.go(current_stat);
        }else{
            if(!localStorage.getItem('actualState') && !localStorage.getItem('currentSate')){
            $state.go('campaignBrowse');
        }

        }
    };

    $scope.startNewCampaign = function(){
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
                        $stateParams.fromEndCampaign = true;
                        $state.go("signup",{motivationAmount : $scope.slider.value});
                        return;
                    }
                }
            ]
        });
    }

    $scope.openVideoModal = function(video_url){
       $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(video_url);
       $scope.modal_video.show();

       // remove multiple video modal instance

       var videoPlayerContainer = document.querySelector('.modal-backdrop .active #video-player-container');

       var goodVideo = JSON.parse(localStorage.getItem('goodVideo'));
       var fakeVideo = JSON.parse(localStorage.getItem('fakeVideo'));

       var _videoId = $scope.videoId || $scope.video_id;

       if(goodVideo !== null || fakeVideo !== null){
            if(videoPlayerContainer.classList.contains('videoBorderGood')){
                videoPlayerContainer.classList.remove('videoBorderGood');
            }else if(videoPlayerContainer.classList.contains('videoBorderFake')){
                videoPlayerContainer.classList.remove('videoBorderFake');
            }

            if(goodVideo !== null && goodVideo.indexOf(_videoId) > -1){
                videoPlayerContainer.className += ' videoBorderGood'; 
            }

            if(fakeVideo !== null && fakeVideo.indexOf(_videoId) > -1){
                videoPlayerContainer.className += ' videoBorderFake'; 
            }
       }
    };

    $scope.closeModal = function(){
      $scope.modal_video.hide();
//      var video = angular.element(document.querySelector('video'));
//        // Loop through each video element 
//        angular.forEach(video, function(obj) {
//            // Apply pause to the object
//            obj.pause();
//      });
    };

    $scope.reportFakeVideo = function(video_id){
     $scope.video_id = video_id;
    };


    /***************************** video open on modal ************************************/
     /* *****  user own profle end**** */


     /* ***** check user login or not start***** */
     if(localStorage.getItem('userInfo')===null){
            $scope.check=0;
            return false;

      }
    /* ***** check user login or not end***** */



    /****** myContribution Method Start************/

    $scope.myContribution=function(){
        $state.go('myContribution');
    };

    /****** myContribution Method End************/


      /**
    * Firebase adding functionlity
    */
    var fromId,toId;
    var fromUserInfo = $scope.userdata.userInfo;
    var toUserInfo = $scope.individual_user_details;

    if(privateMsgSetupFlag === 1){
        fromId = fromUserInfo.result[0].user_id;
        toId = toUserInfo.user_details.user_id;
    }else{
        fromId = fromUserInfo.result[0].user_id;
    }

    $scope.addMessage = function(msg) {
        var msgObj = {
            to_id : (toId == undefined) ? '' : toId,
            from_id : fromId,
            user_image : (fromUserInfo.result.profile_videos == undefined || fromUserInfo.result.profile_videos == '') ? '' : fromUserInfo.result.profile_videos[0].thumb_url,
            text: msg,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        msgRef.$add(msgObj);
        // $scope.messages.push(msgObj);
        $scope.campaign_text = '';
    };


    var newMessageArray = [];

    ref.once('value', function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(privateMsgSetupFlag === 1 && childData.from_id == fromId && childData.toId == null){
                // $scope.messages.$add(childData);
               newMessageArray.push(childData);
            }else if(privateMsgSetupFlag === 2 && childData.from_id == fromId){
               // $scope.messages.$add(childData);
                newMessageArray.push(childData);
            }
        });
        $scope.messages = newMessageArray;
    });


    /* *** Show calory how much user have and given ******** */
    var allId = $stateParams.id || $rootScope.user_id;
    if(allId != null && allId != '' && allId != undefined) {
           localStorage.setItem('allIds_ShowCaloryDetails',allId);
    }
    if(localStorage.getItem('allIds_ShowCaloryDetails')) {
        var allId = localStorage.getItem('allIds_ShowCaloryDetails');
        var data ={
               user_id:allId 
        };
        var data=$rootScope.formatInputString(data);
        CaloryHaveOrGiven.calories(data).then(function(response){
            $scope.total_calorie_given = response.data.result.total_calorie_given;
            $scope.total_calorie_have = response.data.result.total_calorie_have;
        });
    }
    /* *** Show calory how much user have and given ******** */
    $scope.check_campaignId = function(){
        if(localStorage.getItem('campaign_id') == null && localStorage.getItem('campaign_id') == '' && localStorage.getItem('campaign_id') == undefined) {
             toastr.error('Sorry!!You have no active campaign');
             return false;
        }
    };
});


