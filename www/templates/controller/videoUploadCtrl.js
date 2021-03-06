futronics.controller('VideoUploadCtrl', 
function($scope,$rootScope,StorageService,$cordovaFileTransfer, 
    $cordovaFile,$ionicPopup,$cordovaDevice,$cordovaCapture,$cordovaCamera,
$ionicActionSheet, $state,$ionicLoading, Loader,stateFactory,LogoutService,$localstorage,$timeout)  {

    stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
    
    StorageService.storage();

    $scope.data = {};
    $scope.btnDisabled = true;

    $scope.logout=function(){
        LogoutService.logout();
    };
    $scope.hideProgress = true;
       
    if($rootScope.previousState === 'thanksAfterContribution' || 
    $rootScope.previousState === 'contribution' || $rootScope.previousState === 'profile' 
    || $rootScope.previousState === 'profileViewStats'  || $rootScope.previousState === 'mySponsorsUserProfile'
    || $rootScope.previousState === 'myContributionUserProfile'  || $rootScope.previousState === 'endCampaignProfile'){
        $scope.hideProgress = false;
    }
    $scope.myOwnProfile=function(){
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
    };
    $scope.campaign_id=localStorage.getItem('campaign_id');

    console.log(navigator);

    $scope.chooseVideo = function() {
      var options = { limit: 1 }; //,duration : 35
        
        $cordovaCapture.captureVideo(options).then(function(videoData) {
           // do what you want with videoData
           //alert(JSON.stringify(videoData)+'252');
           console.log("videoData--------------------------"+videoData);
            var i, path, len;
            for (i = 0, len = videoData.length; i < len; i += 1) {
                $scope.path = videoData[i].fullPath;
                // $scope.uploadVideo($scope.path);
                $scope.btnDisabled = false;
                navigator.createThumbnail($scope.path, function(err, imageData) {
                    if (err) throw err;
                   $timeout(function(){ $scope.videoSnapshot = imageData;},1000);
                   
                });
            }

        },function(error) {
        //    alert('Capture Error');
        });
  };

    
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if(userInfo.userInfo.result.profile_videos.length == 0){
        $scope.currentWeight = $rootScope.currentWeight;
        $scope.currentWeightDisabled = true;
    }else{
        $scope.currentWeight = $scope.current_weight;
        $scope.currentWeightDisabled = false;
    }   

    $scope.uploadVideo=function(current_weight){
            if(current_weight == '' || current_weight.length >3 || current_weight.length < 2) {
               $ionicPopup.show({
                            template: 'Please enter 2 or 3 digit number only',
                            title: '<p style="color:black"><b>Attention!!!</b></p>',
                            buttons: [
                                { 
                                    text: 'Ok' ,
                                    type: 'button-calm',
                                    onTap: function(e) { 

                                       
                                        return; 
                                    }
                                }
                            ]
                        });
               return false;
            }
            Loader.showLoading();
            
            var path1 = $scope.path;
            var targetpath=path1.substr(path1.lastIndexOf('/') + 1);
            var videourl = '',data = {};

             if($rootScope.isMaintain == 'true'){
                
                videourl="campaignInMaintenancePhaseVideoUploadApi";
                $scope.maintainId=localStorage.getItem('maintainId');
                data={
                    user_id:$rootScope.userId,
                    videos:targetpath,
                    proposed_weight:$rootScope.goal,
                    current_weight:$scope.currentWeight || current_weight,
                    maintenance_id: $scope.maintainId,
                    weight_loss_phase_campaign_id:$rootScope.runningCampaign_id
                };
            }else{
                videourl="userVideoUpload";
                data={
                    user_id:$rootScope.userId,
                    videos:targetpath,
                    campain_id:$scope.campaign_id,
                    to_id:$rootScope.to_id,
                    current_weight:$scope.currentWeight || current_weight
                };
            }

             var options = {
                fileKey: "videos",
                fileName: $scope.path.substr(path1.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "video/mp4",
                httpMethod: "POST",
                params: data
                //params : {user_id:$rootScope.userId,videos:targetpath,campain_id:$scope.campaign_id,to_id:$rootScope.to_id}
            };

           console.log(options);
           
            $cordovaFileTransfer.upload("http://111.93.227.162/crowdfunding/api/"+videourl, $scope.path, options)
            .then(function (data) {
               if(localStorage.getItem('endcampaign')){
                   localStorage.removeItem('endcampaign');
               }
               
               console.log("********");
               console.log(JSON.parse(data.response));
               
                var _data = JSON.parse(data.response);

                Loader.hideLoading();
                if(_data.result.length == 0){
                    $ionicPopup.show({
                        title: _data.message,
                        scope: $scope,
                        buttons: [{   text: 'Ok' ,
                                type: 'button-calm',
                                onTap: function(e) {
                                    return;
                                }
                            }]
                    });
                }else{
                    
                    $ionicPopup.show({
                        title: 'Thank you for video upload',
                        template: 'You receive a calorie for every 3 video uploads.Also, that Your video will be rated by the community and that if it\'s not satisfactory, You shall be prompted to upload a new one',
                        scope: $scope,
                        buttons: [
                            {   text: 'Cancel' ,
                                type: 'button-dark'
                            },{ 
                                text: 'Ok' ,
                                type: 'button-calm',
                                onTap: function(e) {

                                
                                    // var _allUserDetails = JSON.parse(localStorage.getItem('allUserDetails'));
                                    // userInfo.userInfo.result.campaign = _data.campaign;
                                    // if(_data.result.maintence_campaign_all_video || _data.maintence_campaign_all_video) {
                                    //     if(_data.result.maintence_campaign_all_video[0]){
                                    //         userInfo.userInfo.result.profile_videos.push(_data.result.maintence_campaign_all_video[0]);
                                    //     }
                                    // }

                                    // if(_data.result.profile_videos.length > 0){
                                    //     userInfo.userInfo.result.profile_videos.push(_data.result.profile_videos[0]);
                                    // }
                                    
                                    // _allUserDetails[0].campaign = _data.campaign;
                                    // console.log("userInfo",userInfo.userInfo.result);

                                    // localStorage.setItem('video_countdown', _data.maintenance_video_timer_end_time || _data.counter_end_time);
                                    // localStorage.setItem('allUserDetails',JSON.stringify(_allUserDetails));

                                    // $localstorage.setObject("userInfo",userInfo);
                                    // $state.go('congrats_videoupload');
                                    // $scope.data.current_weight = '';
                                    // return;

                                    console.log(_data);
                                    console.log(_data.result);
                                    console.log(_data.result.campaign);
                                    var _allUserDetails = JSON.parse(localStorage.getItem('allUserDetails'));
                                    userInfo.userInfo.result.campaign = _data.result.campaign;
                                    if(_data.result.maintence_campaign_all_video) {
                                        if(_data.maintence_campaign_all_video[0]){
                                            userInfo.userInfo.result.profile_videos.push(_data.result.maintence_campaign_all_video[0]);
                                        }
                                    }

                                    if(_data.result.profile_videos.length > 0){
                                        userInfo.userInfo.result.profile_videos.push(_data.result.profile_videos[0]);
                                    }
                                    
                                    _allUserDetails[0].campaign = _data.result.campaign;
                                    console.log("userInfo",userInfo.userInfo.result);

                                    localStorage.setItem('video_countdown', _data.result.maintenance_video_timer_end_time || _data.result.counter_end_time);
                                    localStorage.setItem('allUserDetails',JSON.stringify(_allUserDetails));

                                    $localstorage.setObject("userInfo",userInfo);
                                    $state.go('congrats_videoupload');
                                    $scope.data.current_weight = '';
                                    return;

                                }
                            }
                        ]
                    });
                }

               
            }, function (err) {
                Loader.hideLoading();
                console.log("ERROR: " + JSON.stringify(err));
            }
      );
    };

    $scope.logout=function(){
        LogoutService.logout();
    };
    

 });