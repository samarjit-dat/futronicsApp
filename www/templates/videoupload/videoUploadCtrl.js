futronics.controller('VideoUploadCtrl',
    function($scope, $rootScope, StorageService, $cordovaFileTransfer,
        $cordovaFile, $ionicPopup, $cordovaDevice, $cordovaCapture, $cordovaCamera,
        $ionicActionSheet, $state, $ionicLoading, Loader, stateFactory, LogoutService,
        $localstorage, $timeout, checkingActualState) {

        if (localStorage.getItem('userInfo')) {

            var user = JSON.parse(localStorage.getItem('userInfo'));
            if (user.userInfo.result[0].user_id != null || user.userInfo.result[0].user_id != '') {
                var user_id = user.userInfo.result[0].user_id;
            }
            stateFactory.setCurrentState($state.current.name, user_id); // For getting value stateFactory.getCurrentState()
            stateFactory.getCurrentState(user_id);
        }
        StorageService.storage();

        $scope.data = {};
        $scope.check = 0;
        $scope.btnDisabled = true;

        $scope.logout = function() {
            LogoutService.logout();
        };
        $scope.hideProgress = true;
        if (localStorage.getItem('actualState')) {
            var acual_state = localStorage.getItem('actualState');

            var lastState = 'upload-video';
            var param = { user_id: $rootScope.user_id, actual_stat: lastState };
            var data = $rootScope.formatInputString(param);
            checkingActualState.post(data).then(function(response) {

                if (response.data.status == 1) {
                    localStorage.setItem('actualState', lastState);
                } else if (response.data.status == 2) {
                    localStorage.setItem('actualState', lastState);
                } else {
                    toastr.error('Sorry,Something went wrong.Try again...');
                    return false;
                }
            });
        }



        if ($rootScope.previousState === 'thanksAfterContribution' ||
            $rootScope.previousState === 'contribution' || $rootScope.previousState === 'profile' ||
            $rootScope.previousState === 'profileViewStats' || $rootScope.previousState === 'mySponsorsUserProfile' ||
            $rootScope.previousState === 'myContributionUserProfile' || $rootScope.previousState === 'endCampaignProfile') {
            $scope.hideProgress = false;
        }
        $scope.myOwnProfile = function() {
            localStorage.removeItem('viewIndividualProfile_globalChat');
            localStorage.setItem('myProfile', '1');
            $state.go('profile');
        };
        $scope.campaign_id = localStorage.getItem('campaign_id');

        $scope.chooseVideo = function() {
            var options = { limit: 1 }; //,duration : 35

            $cordovaCapture.captureVideo(options).then(function(videoData) {

                console.log("videoData--------------------------" + videoData);
                var i, path, len;
                for (i = 0, len = videoData.length; i < len; i += 1) {
                    $scope.path = videoData[i].fullPath;
                    // $scope.uploadVideo($scope.path);
                    $scope.btnDisabled = false;
                    navigator.createThumbnail($scope.path, function(err, imageData) {
                        if (err) throw err;
                        $timeout(function() { $scope.videoSnapshot = imageData; }, 1000);

                    });
                }
            }, function(error) {
                //    alert('Capture Error');
            });
        };


        var userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (userInfo.userInfo.result.profile_videos.length == 0) {
            $scope.currentWeight = $rootScope.currentWeight;
            $scope.currentWeightDisabled = true;
        } else {
            $scope.currentWeight = $scope.current_weight;
            $scope.currentWeightDisabled = false;
        }

        $scope.uploadVideo = function(current_weight) {
            if (current_weight == '') {
                $scope.check = 1;
            }
            if (current_weight.length > 3 || current_weight.length < 2) {
                $scope.check = 2;
            }
            Loader.showLoading();

            var path1 = $scope.path;
            var targetpath = path1.substr(path1.lastIndexOf('/') + 1);
            var videourl = '',
                data = {};

            if ($rootScope.isMaintain == 'true') {

                videourl = "campaignInMaintenancePhaseVideoUploadApi";
                $scope.maintainId = localStorage.getItem('maintainId');
                data = {
                    user_id: $rootScope.userId,
                    videos: targetpath,
                    proposed_weight: $rootScope.goal,
                    current_weight: $scope.currentWeight || current_weight,
                    maintenance_id: $scope.maintainId,
                    weight_loss_phase_campaign_id: $rootScope.runningCampaign_id
                };
            } else {
                videourl = "userVideoUpload";
                data = {
                    user_id: $rootScope.userId,
                    videos: targetpath,
                    campain_id: $scope.campaign_id,
                    to_id: $rootScope.to_id,
                    current_weight: $scope.currentWeight || current_weight
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

            $cordovaFileTransfer.upload("http://111.93.227.162/crowdfunding/api/" + videourl, $scope.path, options)
                .then(function(data) {
                    if (localStorage.getItem('endcampaign')) {
                        localStorage.removeItem('endcampaign');
                    }
                    var _data = JSON.parse(data.response);

                    Loader.hideLoading();
                    if (_data.result.length == 0) {
                        $ionicPopup.show({
                            title: _data.message,
                            scope: $scope,
                            buttons: [{
                                text: 'Ok',
                                type: 'button-calm',
                                onTap: function(e) {
                                    return;
                                }
                            }]
                        });
                    } else {

                        $ionicPopup.show({
                            title: 'Thank you for video upload',
                            template: 'You receive a calorie for every 3 video uploads.Also, that Your video will be rated by the community and that if it\'s not satisfactory, You shall be prompted to upload a new one',
                            scope: $scope,
                            buttons: [{
                                text: 'Cancel',
                                type: 'button-dark'
                            }, {
                                text: 'Ok',
                                type: 'button-calm',
                                onTap: function(e) {
                                    var _allUserDetails = JSON.parse(localStorage.getItem('allUserDetails'));
                                    userInfo.userInfo.result.campaign = _data.result.campaign;
                                    if (_data.result.maintence_campaign_all_video) {
                                        if (_data.maintence_campaign_all_video[0]) {
                                            userInfo.userInfo.result.profile_videos.push(_data.result.maintence_campaign_all_video[0]);
                                        }
                                    }

                                    if (_data.result.profile_videos.length > 0) {
                                        userInfo.userInfo.result.profile_videos.push(_data.result.profile_videos[0]);
                                    }

                                    _allUserDetails[0].campaign = _data.result.campaign;

                                    localStorage.setItem('video_countdown', _data.result.maintenance_video_timer_end_time || _data.result.counter_end_time);
                                    localStorage.setItem('allUserDetails', JSON.stringify(_allUserDetails));

                                    $localstorage.setObject("userInfo", userInfo);
                                    $state.go('congrats_videoupload');
                                    $scope.data.current_weight = '';
                                    return;

                                }
                            }]
                        });
                    }
                }, function(err) {
                    Loader.hideLoading();
                    console.log("ERROR: " + JSON.stringify(err));
                });
        };

        $scope.logout = function() {
            LogoutService.logout();
        };
    });