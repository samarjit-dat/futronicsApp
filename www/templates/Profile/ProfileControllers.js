futronics.controller('ProfileCtrl',
    function($scope, $rootScope, AccountService, UserListService, check_GlobalCommunity,
        $ionicHistory, StorageService, $ionicModal, $sce, $http, $state,
        $window, $localstorage, $ionicPopup, URL, $location, IMAGE, stateFactory, LogoutService,
        FakeVideoService, GoodVideoService, FakevideoReportList, $firebaseArray, $stateParams,
        CaloryHaveOrGiven, FakeOrGood, $timeout, StartNewCampaign, RefState,
        MotivationPercent, NotificationSettings, checkingActualState) {

        $scope.privateMsgSetupFlag = 0;
        $rootScope.disabledAddbutton = 0;

        /**
         * Firebase setup
         */
        var ref = firebase.database().ref().child("chat").child("private");
        var msgRef = $firebaseArray(ref);
        $scope.messages = $firebaseArray(ref);

        var myTitleJSon = JSON.parse(localStorage.getItem('userInfo'));
        $scope.video_countdown = '';


        $scope.$on('$ionicView.enter', function() {
            if (localStorage.getItem('startnew')) {
                $rootScope.unCompleteCampaign = 0;
            }
            if (localStorage.getItem('video_countdown')) {
                $scope.video_countdown = localStorage.getItem('video_countdown');
            }
            if (localStorage.getItem('endcampaign', "success") === 'success') {
                $scope.endCampaignStatus = 1;
				if (localStorage.getItem('actualState'))
                    localStorage.removeItem('actualState');
            } else {
                $scope.endCampaignStatus = 0;
            }
            if (localStorage.getItem('userInfo')) {
                if ($rootScope.user_details.userInfo.result.campaign.length) {
                    MotivationPercent.getPercent($rootScope.formatInputString({ user_id: $rootScope.user_id || $rootScope.userId, campaign_id: $rootScope.user_details.userInfo.result['campaign'][0]['campaign_id'] }))
                        .then(function(res) {
                            $scope.motivation_percentage = Math.round(res.data.result.percentile_amount_collected).toFixed();
                        })
                }

            } else {
                $rootScope.disabledAddbutton = 1;
            }

            if (localStorage.getItem('userInfo')) {
                FakeOrGood.getArrayList($rootScope.formatInputString({ user_id: $rootScope.user_id || $rootScope.userId }))
                    .then(function(res) {
                        (res.data.result.all_users_marked_good.length > 0) ? localStorage.setItem('goodVideo', res.data.result.all_users_marked_good): localStorage.setItem('goodVideo', '');
                        (res.data.result.all_users_marked_fake.length > 0) ? localStorage.setItem('fakeVideo', res.data.result.all_users_marked_fake): localStorage.setItem('fakeVideo', '');
                    });
            }

        });

        if (myTitleJSon === null) {
            $scope.myTitle = '';
        } else {
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
        if (localStorage.getItem('hideuploadpage')) {
            $scope.hideOption = localStorage.getItem('hideuploadpage');
            $rootScope.unCompleteCampaign = 0;
        }

        if (localStorage.getItem('userInfo')) {
            var param = { user_id: $rootScope.user_id };
            var data = $rootScope.formatInputString(param);
            RefState.get(data).then(function(response) {

                if (response.data.status == 2) {
                    var status = response.data.result.ref_status;
                    localStorage.setItem("refrstate", status);
                    if (localStorage.getItem("refrstate")) {
                        $scope.referStae = localStorage.getItem("refrstate");

                        if ($scope.referStae == 1 || $scope.referStae == 2) {
                            $rootScope.unCompleteCampaign = 1;

                            if ($scope.referStae == 1) {
                                (localStorage.setItem('actualState', 'upload-video'));
                            } else if ($scope.referStae == 2) {
                                (localStorage.setItem('actualState', 'questions'));
                            } else {
                                $scope.showOrhidenav = 1;
                            }
                        }
                    }
                } else {
                    return false;
                }
            })

        }

        if ($rootScope.user_id == '' || $rootScope.user_id == undefined) {
            $scope.show_gear = 0;
        } else {
            $scope.show_gear = 1;
        }


        if (localStorage.getItem('userInfo')) {
            var user = JSON.parse(localStorage.getItem('userInfo'));

            if (user.userInfo.result.campaign.length) {
                $scope.c_status = user.userInfo.result.campaign[0].campaign_status;
                $scope.contributor = user.userInfo.result.contributor.length;
            }
            $scope.p_video = user.userInfo.result.profile_videos.length;

            if ($scope.c_status == 1 && $scope.p_video == 0) {


                var param = { user_id: $rootScope.user_id };
                var data = $rootScope.formatInputString(param);
                RefState.get(data).then(function(response) {
                    if (response.data.status == 2) {
                        var status = response.data.result.ref_status;
                        localStorage.setItem("refrstate", status);

                        var c_state = (localStorage.getItem('currentSate'));
                        var a_state = (localStorage.getItem('actualState'));
                        var refState = localStorage.getItem("refrstate");

                        if (refState == 3) {
                            localStorage.setItem('currentSate', "campaignBrowse");
                            localStorage.setItem('actualState', 'campaignBrowse');
                        } else if (refState == 2) {
                            localStorage.setItem('currentSate', "questions");
                            localStorage.setItem('actualState', 'questions');
                        } else {
                            localStorage.setItem('currentSate', "upload-video");
                            localStorage.setItem('actualState', 'upload-video');
                        }


                    } else {
                        //toastr.error('Sorry,Something went wrong.Try again...');
                        return false;
                    }
                })


            }

            if (($scope.c_status == 1 && $scope.p_video > 0) || ($scope.c_status == 2) || ($scope.c_status == 0 && $rootScope.previousState == "endCampaignProfile")) {
                $scope.showOrhidenav = 1;
            } else {
                $scope.showOrhidenav = 0;
                // if ($scope.contributor > 0 && $scope.c_status == 0) {
                //     $scope.showOrhidenav = 1;
                // } else {
                //     $scope.showOrhidenav = 0;
                // }

            }
        }
        /** To hide complete your campaign link if campaign status 1 **** */


        /** To hide complete your campaign link if campaign status 1 **** */

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




        $scope.uid = $rootScope.user_id;
        if (localStorage.getItem('otherProfileDetails')) {
            $scope.otheruserId = localStorage.getItem('otherProfileDetails');
        }

        if (localStorage.getItem('campaignCompleteOrNot')) {
            if (localStorage.getItem('userInfo')) {
                if ($rootScope.user.userInfo.result.profile_videos.length === 0) {
                    $scope.completeOrNot = localStorage.getItem('campaignCompleteOrNot');
                    if (localStorage.getItem('showGlobalChat_afterEndCampaign')) {
                        localStorage.removeItem('showGlobalChat_afterEndCampaign');
                    }
                }
            }

            if (localStorage.getItem('endcampaign')) {
                $scope.completeOrNot = localStorage.getItem('campaignCompleteOrNot');
                if (localStorage.getItem('showGlobalChat_afterEndCampaign')) {
                    localStorage.removeItem('showGlobalChat_afterEndCampaign');
                }
            }

        }
        if (localStorage.getItem('showGlobalChat_afterEndCampaign')) {
            $scope.completeOrNot = localStorage.getItem('showGlobalChat_afterEndCampaign');
            localStorage.removeItem('campaignCompleteOrNot');
        }


        /* *************** Show User List End********************************************************** */
        /*** checking for Login or Logout state start****/

        $scope.check = 0;
        $scope.userdata = '';

        $scope.userdata = AccountService.getUserInfo();

        if ($scope.userdata == undefined) {
            $scope.check = 0;
        } else {
            $scope.check = $scope.userdata.userInfo.status;
        }
        /*** checking for Login or Logout state end****/

        $scope.user_id = '';
        $scope.logout = function() {
            LogoutService.logout();
        };
        $scope.slideHasChanged = function(index) {

            //$scope.items.push("{name:'John', age:25, gender:'boy'}");
        }

        /* **************** Fetch USERINFO FROM LOCALSTORAGE End*********************************** */
        $scope.checkMember = function() {
                check_GlobalCommunity.check_memberOrNot();
            }
            /* *** username and details start *** */
        $scope.myProfile = 0;
        $scope.otherProfile = '';


        var imgObj = [];
        $scope.videoId = [];
        $scope.mainImage = IMAGE.BASE_IMAGE;

        if (localStorage.getItem('viewIndividualProfile_globalChat') != null) {

            $scope.privateMsgSetupFlag = 1;
            $scope.otherProfile = 1;
            $scope.myProfile = 0;
            $scope.individual_user_details = JSON.parse(localStorage.getItem('viewIndividualProfile_globalChat'));

            /*******************************Image push start************************************/

            if ($scope.individual_user_details.campaign.length !== 0) {
                $scope.status = $scope.individual_user_details.campaign[0].campaign_status;
            }
            var goodVideoList = localStorage.getItem('goodVideo');
            var fakeVideoList = localStorage.getItem('fakeVideo');

            if (localStorage.getItem('userInfo')) {
                if ($scope.individual_user_details.profile_videos.length > 0) {
                    $scope.individual_user_details.profile_videos.forEach(function(ele) {

                        var requiredParams = [];

                        requiredParams['thumb_url'] = ele.thumb_url;
                        requiredParams['video_url'] = ele.video_url;
                        requiredParams['user_videos_id'] = ele.user_videos_id;
                        requiredParams['user_id'] = ele.user_id;

                        if (fakeVideoList != null) {
                            requiredParams['user_whose_video_fake'] = (ele.user_videos_id, fakeVideoList.indexOf(ele.user_videos_id) > -1) ? ele.user_videos_id : null;
                        }
                        if (goodVideoList != null) {
                            requiredParams['user_whose_video_good'] = (ele.user_videos_id, goodVideoList.indexOf(ele.user_videos_id) > -1) ? ele.user_videos_id : null;
                        }
                        imgObj.push(requiredParams);

                    });

                    if (imgObj.length > 0) {
                        $scope.profileImages = array_chunk(imgObj, 3);

                        function array_chunk(array, chunkSize) {
                            return [].concat.apply([],
                                array.map(function(elem, i) {
                                    return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
                                })
                            );
                        }

                        if (imgObj[0]['thumb_url']) {
                            $scope.mainImage = imgObj[0]['thumb_url'];
                            $scope.videoId = imgObj[0]['user_videos_id'];
                            $scope.other_user_id = imgObj[0]['user_id'];
                        }

                    } else {
                        $scope.mainImage = IMAGE.BASE_IMAGE;
                    }
                }
            }

            /*******************************Image push end************************************/
        }

        /* *** username and details end *** */


        /* *****  user own profle start **** */

        if (localStorage.getItem('myProfile') != null) {
            //alert(localStorage.getItem('refrstate') + "myprofile")
            $scope.privateMsgSetupFlag = 2;
            $scope.totalCampaign = '';
            $scope.myProfile = 0;
            $scope.my_details = '';
            $scope.my_details = JSON.parse(localStorage.getItem('userInfo'));

            if ($scope.my_details.userInfo.result.campaign.length !== 0) {
                $scope.status = $rootScope.campaign_status;
                $scope.loggedInUser = 1;
            }

            //   $scope.my_details.userInfo.result.profile_images.forEach(function(ele){
            //     var requiredParams = [];
            //     var imageStr = ele.profile_image;
            //     requiredParams['profile_image'] = imageStr;
            //     imgObj.push(requiredParams);
            //   });

            if ($scope.my_details.userInfo.result.profile_videos.length > 0) {
                $scope.my_details.userInfo.result.profile_videos.forEach(function(ele) {
                    var requiredParams = [];
                    requiredParams['thumb_url'] = ele.thumb_url;
                    requiredParams['video_url'] = ele.video_url;
                    requiredParams['user_videos_id'] = ele.user_videos_id;
                    requiredParams['user_id'] = ele.user_id;
                    requiredParams['user_whose_video_fake'] = (ele.user_whose_video_fake === undefined) ? null : ele.user_whose_video_fake;
                    requiredParams['user_whose_video_good'] = (ele.user_whose_video_good === undefined) ? null : ele.user_whose_video_good;
                    imgObj.push(requiredParams);
                });

                if (imgObj.length > 0) {

                    var appBasePath = $location.absUrl();
                    appBasePath = appBasePath.substring(0, appBasePath.indexOf('#'));
                    $scope.mainImage = appBasePath + 'img/circle.png';

                    $scope.profileImages = array_chunk(imgObj, 3);

                    function array_chunk(array, chunkSize) {
                        return [].concat.apply([],
                            array.map(function(elem, i) {
                                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
                            })
                        );
                    }

                    if (imgObj[0]['profile_image']) {
                        $scope.mainImage = imgObj[0]['profile_image'];
                    } else if (imgObj[0]['thumb_url']) {
                        $scope.mainImage = imgObj[0]['thumb_url'];
                        $scope.videoId = imgObj[0]['user_videos_id'];
                    }
                } else {
                    $scope.mainImage = IMAGE.BASE_IMAGE;
                }
            }

            if ($scope.my_details.userInfo.result.campaign == []) {
                $scope.totalCampaign = 0;
            }


        } else {
            $scope.totalCampaign = 0;
            $scope.myProfile = 1;
        }

        if (($scope.status == 1 || $scope.status == 2) && ($scope.loggedInUser == 1)) {

            var user, user_id;
            if (localStorage.getItem('userInfo')) {
                user = JSON.parse(localStorage.getItem('userInfo'));
                if (user.userInfo.result[0].user_id != null || user.userInfo.result[0].user_id != '')
                    user_id = user.userInfo.result[0].user_id;

            }

            var param = { user_id: user_id };
            var data = $rootScope.formatInputString(param);
            checkingActualState.get(data).then(function(response) {

                if (response.data.status == 1) {
                    var actualstate = response.data.result[0].actual_stat;

                    if (actualstate == "") {

                        if (localStorage.getItem('currentSate')) {
                            var lastState = localStorage.getItem('currentSate');

                            var param = { user_id: user_id, actual_stat: lastState };
                            var data = $rootScope.formatInputString(param);
                            checkingActualState.post(data).then(function(response) {

                                if (response.data.status == 1) {
                                    localStorage.setItem('actualState', lastState);
                                } else if (response.data.status == 2) {
                                    localStorage.setItem('actualState', lastState);
                                } else {
                                    toastr.error('If you are  in logout state.Please login');
                                    return false;
                                }
                            });
                        }
                    } else {
                        localStorage.setItem('actualState', actualstate);
                        if (localStorage.getItem('actualState')) {
                            var a_state = localStorage.getItem('actualState');
                            var c_state = localStorage.getItem('currentSate');

                            if (c_state === 'campaignBrowse') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'contribution') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'addFund') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'thanksAfterContribution') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'profile') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'profileViewStats') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'account_settings') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'contactAdmin') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'myContribution') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'myContributionUserProfile') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'sponsorsAcquired') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'mySponsorsUserProfile') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'withdrawCaloryAndCash') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'chat') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'login') {
                                localStorage.setItem('actualState', a_state);
                            } else if (c_state === 'myCampaign') {
                                localStorage.setItem('actualState', a_state);
                            } else {
                                localStorage.setItem('actualState', c_state);
                            }

                            if (c_state === 'endCampaignProfile') {
                                localStorage.removeItem('actualState');
                            }
                        }
                    }

                } else {
                    return false;
                }
            });
        } else {
            localStorage.removeItem('actualState');
        }

        $scope.user_list = function() {
            localStorage.setItem('statusCheck', $scope.status);
            if ($scope.status == 0) {
                localStorage.setItem('campaignCompleteOrNot', $rootScope.user_id);
            } else {
                localStorage.setItem('campaignCompleteOrNot', $rootScope.user_id);
            }
            $state.go('campaignBrowse');
        };


        /************************** video open on modal **************************************/
        $scope.openMainImageVideoModal = function() {

            var id, profileImagesDomEle;
            if ($scope.videoId) {
                id = $scope.videoId;
                profileImagesDomEle = angular.element(document.getElementById(id));
            }
            if ($scope.videoId == undefined) {
                id = '#profileImage';
                profileImagesDomEle = angular.element(document.querySelector(id));
            }

            $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(profileImagesDomEle[0].alt);
            if (profileImagesDomEle[0].alt !== '' && profileImagesDomEle[0].alt !== 'undefined') {
                $scope.modal_video.show();
            } else {
                $scope.modal_video.hide();
            }
        };

        $scope.reportGoodVideo = function(video_id) {
            $scope.video_id = video_id;
        };

        FakevideoReportList.list().then(function(response) {
            for (var i = 0; i < response.data.result.length; i++) {
                $scope.fakelist.push(response.data.result[i]);
            }
        });

        $scope.fakeResponseList = function(listid) {
            $scope.fakeTypeId = listid;
        };

        var fakeVideo = [];
        $scope.fakeVideo = function() {

            if (localStorage.getItem('fakeVideo')) {
                var fakeid = localStorage.getItem('fakeVideo');
                var flag_fake, good_flag;
                if (fakeid.indexOf($scope.video_id) > -1) {
                    flag_fake = 1;
                } else {
                    if (localStorage.getItem('goodVideo')) {
                        var goodid = localStorage.getItem('goodVideo');
                        if (goodid.indexOf($scope.video_id) > -1) {
                            good_flag = 3;
                        } else {
                            flag_fake = 0;
                        }
                    } else {
                        flag_fake = 0;
                    }
                }
                if (flag_fake == 1) {
                    $ionicPopup.show({
                        template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as fake',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm'
                        }]
                    });
                }

                if (good_flag == 3) {
                    $ionicPopup.show({
                        template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as good',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm'
                        }]
                    });
                }
                if (flag_fake == 0) {
                    $scope.fakeReport();
                }
            } else {
                if (localStorage.getItem('goodVideo')) {
                    var goodid = localStorage.getItem('goodVideo');
                    if (goodid.indexOf($scope.video_id) > -1) {
                        good_flag = 3;
                    } else {
                        flag_fake = 0;
                    }


                } else {
                    if ($scope.alreadyHit_flag = 0) {
                        $ionicPopup.show({
                            template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as fake',
                            title: '<p style="color:black"><b>Report To Admin</b></p>',
                            scope: $scope,
                            buttons: [{
                                text: 'Ok',
                                type: 'button-calm'
                            }]
                        });
                    } else {
                        flag_fake = 0;
                    }
                }


                if (good_flag == 3) {
                    $ionicPopup.show({
                        template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as good',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm'
                        }]
                    });
                }
                if (flag_fake == 0) {
                    $scope.fakeReport();
                }
            }

        };


        $scope.fakeReport = function() {

            if (localStorage.getItem('otherUserCampaignId')) {
                var otheruser_campaignid = localStorage.getItem('otherUserCampaignId');

                if (localStorage.getItem('userInfo')) {
                    if ($rootScope.user.userInfo.result[0].user_id != '' || $rootScope.user.userInfo.result[0].user_id != null) {
                        if ($scope.other_user_id) {
                            if ($scope.other_user_id != $rootScope.user_id) {
                                $ionicPopup.show({
                                    templateUrl: 'reportPopupFake.html',
                                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                                    scope: $scope,
                                    buttons: [{
                                            text: 'cancel',
                                            type: 'button-dark'
                                        },
                                        {
                                            text: 'Ok',
                                            type: 'button-calm',
                                            onTap: function(e) {
                                                if ($scope.fakeTypeId) {
                                                    if ($rootScope.isMaintain == 'false') {

                                                        var data = {
                                                            video_id: $scope.video_id,
                                                            user_who_marked_fake: $rootScope.user_id,
                                                            user_whose_video_fake: $scope.other_user_id,
                                                            campaign_id: otheruser_campaignid,
                                                            fake_reason_option_id: $scope.fakeTypeId
                                                        };
                                                    } else {
                                                        if (localStorage.getItem('maintainId'))
                                                            var maintainId = localStorage.getItem('maintainId');
                                                        var data = {
                                                            maintence_video_id: $scope.video_id,
                                                            user_who_marked_fake: $rootScope.user_id,
                                                            user_whose_video_fake: $scope.other_user_id,
                                                            maintence_id: maintainId,
                                                            fake_reason_option_id: $scope.fakeTypeId
                                                        };
                                                    }
                                                    var data = $rootScope.formatInputString(data);
                                                    FakeVideoService.fakeVideo(data).then(function(response) {
                                                        if (response.data.status == 1) {
                                                            var f_id = $scope.video_id;
                                                            if (!localStorage.getItem('fakeVideo')) {
                                                                localStorage.setItem('fakeVideo', [f_id]);
                                                                // localStorage.setItem('fakeVideo',JSON.stringify([f_id]));
                                                            } else {
                                                                fakeVideo = localStorage.getItem('fakeVideo');
                                                                if (typeof(fakeVideo) == "string") {
                                                                    fakeVideo = [];
                                                                }
                                                                fakeVideo.push(f_id);
                                                                localStorage.setItem('fakeVideo', fakeVideo);
                                                                // localStorage.setItem('fakeVideo',JSON.stringify(fakeVideo));
                                                            }
                                                            $scope.fakeButton = $scope.video_id;
                                                            $scope.goodButton = $scope.video_id;
                                                            $ionicPopup.show({
                                                                template: 'Thank you for your report, ' + $scope.individual_user_details.user_details.username + ' will be notified to post a new video if 3 or more people report the video, and they will be informed of what to fix.',
                                                                title: '<p style="color:black"><b>Report To Admin</b></p>',
                                                                scope: $scope,
                                                                buttons: [{
                                                                    text: 'Ok',
                                                                    type: 'button-calm'
                                                                }]
                                                            });
                                                        } else {
                                                            $scope.alreadyHit_flag = 0;
                                                            $ionicPopup.show({
                                                                template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as fake',
                                                                title: '<p style="color:black"><b>Report To Admin</b></p>',
                                                                scope: $scope,
                                                                buttons: [{
                                                                    text: 'Ok',
                                                                    type: 'button-calm'
                                                                }]
                                                            });
                                                        }
                                                    });
                                                    return;
                                                } else {
                                                    toastr.error('Please mention a reason before report');
                                                }
                                            }
                                        }

                                    ]
                                });
                            } else {
                                $ionicPopup.show({
                                    template: "You Can't report against you by yourself",
                                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                                    scope: $scope,
                                    buttons: [{
                                        text: 'Ok',
                                        type: 'button-calm',
                                    }]
                                });
                            }
                        }
                    } else {
                        $ionicPopup.show({
                            template: 'Please Login to report',
                            title: '<p style="color:black"><b>Attention!!!</b></p>',
                            scope: $scope,
                            buttons: [{
                                text: 'Ok',
                                type: 'button-calm',
                                onTap: function(e) {
                                    $scope.modal_video.hide();
                                    $state.go("login");
                                    return;

                                }
                            }]
                        });
                    }
                } else {
                    $ionicPopup.show({
                        template: 'Please Login to report',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm',
                            onTap: function(e) {
                                $scope.modal_video.hide();
                                $state.go("login");
                                return;

                            }
                        }]
                    });
                }
            } else {
                $ionicPopup.show({
                    template: "You may try to report your own video.You can only report other user videos",
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [{
                        text: 'Ok',
                        type: 'button-calm'
                    }]
                });
            }
        };

        var goodVideo = [];
        $scope.goodVideo = function() {
            //alert('chick')
            if (localStorage.getItem('fakeVideo')) {
                var fakeid = localStorage.getItem('fakeVideo');
                var flag_fake, good_flag;
                if (fakeid.indexOf($scope.video_id) > -1) {
                    flag_fake = 1;
                } else {
                    if (localStorage.getItem('goodVideo')) {
                        var goodid = localStorage.getItem('goodVideo');
                        if (goodid.indexOf($scope.video_id) > -1) {
                            good_flag = 3;
                        } else {
                            good_flag = 4;
                        }
                    } else {
                        good_flag = 4;
                    }
                }


                if (flag_fake == 1) {
                    $ionicPopup.show({
                        template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as fake',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm'
                        }]
                    });
                }

                if (good_flag == 3) {
                    $ionicPopup.show({
                        template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as good',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm'
                        }]
                    });
                }
                if (good_flag == 4) {
                    $scope.goodReport();
                }
            } else {
                if ($scope.alreadyHit_flag = 0) {
                    $ionicPopup.show({
                        template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as fake',
                        title: '<p style="color:black"><b>Report To Admin</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm'
                        }]
                    });
                } else {
                    if (localStorage.getItem('goodVideo')) {
                        var goodid = localStorage.getItem('goodVideo');

                        if (goodid.indexOf($scope.video_id) > -1) {
                            good_flag = 3;
                        } else {
                            good_flag = 4;
                        }

                        if ($scope.good_flag == 4) {
                            $scope.goodReport();
                        }

                        if (good_flag == 3) {
                            $ionicPopup.show({
                                template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as good',
                                title: '<p style="color:black"><b>Report To Admin</b></p>',
                                scope: $scope,
                                buttons: [{
                                    text: 'Ok',
                                    type: 'button-calm'
                                }]
                            });
                        }
                    } else {
                        if ($scope.alreadyHit_flag_good == 0) {
                            $ionicPopup.show({
                                template: 'You already report ' + $scope.individual_user_details.user_details.username + 's video as good',
                                title: '<p style="color:black"><b>Report To Admin</b></p>',
                                scope: $scope,
                                buttons: [{
                                    text: 'Ok',
                                    type: 'button-calm'
                                }]
                            });
                        } else {
                            $scope.goodReport();
                        }
                    }
                }

            }

        };


        $scope.goodReport = function() {
            if (localStorage.getItem('otherUserCampaignId')) {
                var otheruser_campaignid = localStorage.getItem('otherUserCampaignId');

                if (localStorage.getItem('userInfo')) {
                    if ($rootScope.user.userInfo.result[0].user_id != '' || $rootScope.user.userInfo.result[0].user_id != null) {
                        if ($scope.other_user_id) {
                            if ($scope.other_user_id != $rootScope.user_id) {
                                if ($scope.videoId != 'profileImage') {
                                    $ionicPopup.show({
                                        template: 'You are about to give a “good” rating for this video, indicating that it abides by the Diet Money Policy',

                                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                                        scope: $scope,
                                        buttons: [{
                                                text: 'cancel',
                                                type: 'button-dark'
                                            },
                                            {
                                                text: 'Ok',
                                                type: 'button-calm',
                                                onTap: function(e) {
                                                    var data = {
                                                        video_id: $scope.video_id,
                                                        user_whose_video_good: $scope.other_user_id,
                                                        user_who_marked_good: $rootScope.user_id,
                                                        campaign_id: otheruser_campaignid

                                                    };
                                                    var data = $rootScope.formatInputString(data);
                                                    GoodVideoService.goodVideo(data).then(function(response) {

                                                        if (response.data.status == 1) {
                                                            var g_id = $scope.video_id;
                                                            if (!localStorage.getItem('goodVideo')) {
                                                                localStorage.setItem('goodVideo', [g_id]);
                                                            } else {
                                                                goodVideo = localStorage.getItem('goodVideo');
                                                                if (typeof(goodVideo) == "string") {
                                                                    goodVideo = [];
                                                                }
                                                                goodVideo.push(g_id);
                                                                localStorage.setItem('goodVideo', goodVideo);
                                                            }
                                                            $ionicPopup.show({
                                                                template: 'Thank you for your report, the ' + $scope.individual_user_details.user_details.username + ' will be benifited to get your valuable response.',
                                                                title: '<p style="color:black"><b>Report To Admin</b></p>',
                                                                scope: $scope,
                                                                buttons: [{
                                                                    text: 'Ok',
                                                                    type: 'button-calm'
                                                                }]
                                                            });
                                                        } else {
                                                            $scope.alreadyHit_flag_good = 0;
                                                        }
                                                    });
                                                    return;
                                                }
                                            }
                                        ]
                                    });
                                }
                            } else {
                                $ionicPopup.show({
                                    template: "You Can't report against you by yourself",
                                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                                    scope: $scope,
                                    buttons: [{
                                        text: 'Ok',
                                        type: 'button-calm',

                                    }]
                                });
                            }

                        }
                    } else {
                        $ionicPopup.show({
                            template: 'Please Login to report',
                            title: '<p style="color:black"><b>Attention!!!</b></p>',
                            scope: $scope,
                            buttons: [{
                                text: 'Ok',
                                type: 'button-calm',
                                onTap: function(e) {
                                    $scope.modal_video.hide();
                                    $state.go("login");
                                    return;

                                }
                            }]
                        });
                    }
                } else {
                    $ionicPopup.show({
                        template: 'Please Login to report',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm',
                            onTap: function(e) {
                                $scope.modal_video.hide();
                                $state.go("login");
                                return;

                            }
                        }]
                    });
                }
            } else {
                $ionicPopup.show({
                    template: "You have no active campaign right now.So,you Can't review about the video.Are you want to start a new one?",
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [{
                            text: 'cancel',
                            type: 'button-dark'
                        },
                        {
                            text: 'Ok',
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

        $scope.completeCampaign = function() {
            if (localStorage.getItem('actualState')) {
                var current_state = localStorage.getItem('actualState');
                $state.go(current_state);
            } else if (localStorage.getItem('currentSate')) {
                var current_stat = localStorage.getItem('currentSate');
                $state.go(current_stat);
            } else {
                if (!localStorage.getItem('actualState') && !localStorage.getItem('currentSate')) {
                    $state.go('campaignBrowse');
                }

            }
        };

        $scope.videoLength = imgObj.length;

        $scope.startNewCampaign = function() {
            if ($scope.status == 1) {
                toastr.error('Sorry!!You have already start a campaign');
                return false;
            } else if ($scope.status == 2) {
                toastr.error('you have a campaign in hidden stage,Please end the campaign before start another');
                return false;
            } else {
                $scope.slider = {
                    value: 0,
                    options: {
                        floor: 0,
                        ceil: 1000,
                        step: 5,
                        translate: function(value) { return '&dollar;' + value; },
                        id: 'slideEnded',
                        onEnd: $scope.myEndListener
                    }
                };
                $ionicPopup.show({
                    template: '<rzslider rz-slider-model="slider.value" rz-slider-on-click="getSliderVal()" rz-slider-options="slider.options"></rzslider>',
                    title: '<p style="color:black"><b>What amount motivates you?</b></p>',
                    scope: $scope,
                    buttons: [{
                        text: 'Cancel',
                        type: 'button-dark'
                    }, {
                        text: '<b>Save</b>',
                        type: 'button-calm',
                        onTap: function(e) {
                            StartNewCampaign.isActive($rootScope.formatInputString({ user_id: $rootScope.userId || $rootScope.user_id }))
                                .then(function(res) {

                                    if (res.data.status == 2) {
                                        StartNewCampaign.updateStatus($rootScope.formatInputString({ user_id: $rootScope.userId || $rootScope.user_id }))
                                            .then(function(res_p) {
                                                localStorage.setItem('startnew', "active");

                                                $state.go("signup", { motivationAmount: $scope.slider.value, fromEndCampaign: 1 });
                                                return;
                                            });
                                    } else {
                                        localStorage.setItem('startnew', "active");
                                        $state.go("signup", { motivationAmount: $scope.slider.value, fromEndCampaign: 1 });
                                        return;
                                    }
                                });
                        }
                    }]
                });
            }
        }

        $scope.openVideoModal = function(video_url, id, parentEle) {
            $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(video_url);
            $scope.modal_video.show();

            var videoPlayerContainer = document.querySelector('.modal-backdrop .active #video-player-container');
            var videoDataId = parentEle[0];

            var goodVideo = localStorage.getItem('goodVideo');
            var fakeVideo = localStorage.getItem('fakeVideo');

            var _videoId = id;

            if (goodVideo || fakeVideo) {

                if (videoPlayerContainer.classList.contains('videoBorderGood')) {
                    videoPlayerContainer.classList.remove('videoBorderGood');
                } else if (videoPlayerContainer.classList.contains('videoBorderFake')) {
                    videoPlayerContainer.classList.remove('videoBorderFake');
                }

                if (goodVideo && goodVideo.indexOf(_videoId) > -1) {

                    if (videoDataId.classList.contains('bad')) {
                        videoDataId.classList.remove('bad');
                    }

                    if (videoDataId.classList.contains('good') || videoDataId.classList.contains('both_null')) {
                        videoDataId.classList.remove('both_null');
                        videoDataId.classList.remove('good');
                    }
                    videoDataId.className += ' good';
                    videoPlayerContainer.className += ' videoBorderGood';
                }

                if (fakeVideo && fakeVideo.indexOf(_videoId) > -1) {

                    if (videoDataId.classList.contains('good')) {
                        videoDataId.classList.remove('good');
                    }

                    if (videoDataId.classList.contains('bad') || videoDataId.classList.contains('both_null')) {
                        videoDataId.classList.remove('both_null');
                        videoDataId.classList.remove('bad');
                    }
                    videoDataId.className += ' bad';

                    videoPlayerContainer.className += ' videoBorderFake';
                }
            }
        };

        $scope.closeModal = function() {
            $scope.modal_video.hide();
        };

        $scope.reportFakeVideo = function(video_id) {
            $scope.video_id = video_id;
        };
        /***************************** video open on modal ************************************/

        /****** myContribution Method Start************/

        $scope.myContribution = function() {
            if (localStorage.getItem('userInfo')) {
                $state.go('myContribution');
            } else {
                toastr.error('Please login to see contribution list');
                return false;
            }
        };

        /****** myContribution Method End************/
        /* *****  user own profle end**** */

        /* ***** check user login or not start***** */
        if (localStorage.getItem('userInfo') === null) {
            $scope.check = 0;
            return false;

        }
        /* ***** check user login or not end***** */

        /**
         * Firebase adding functionlity
         */
        var fromId, toId;
        var fromUserInfo = $scope.userdata.userInfo;
        var toUserInfo = $scope.individual_user_details;

        if ($scope.privateMsgSetupFlag == 1) {
            fromId = $rootScope.user_id || $rootScope.userId;
            toId = $stateParams.id;
        } else if ($scope.privateMsgSetupFlag == 2) {
            fromId = $rootScope.user_id || $rootScope.userId;
            toId = '';
        } else {
            fromId = $stateParams.id;
        }

        $scope.addMessage = function(msg) {
            if (msg) {
                var msgObj = {
                    to_id: toId,
                    from_id: fromId,
                    user_image: (fromUserInfo.result.profile_videos == undefined || fromUserInfo.result.profile_videos == '') ? '' : fromUserInfo.result.profile_videos[0].thumb_url,
                    text: msg,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                };
                msgRef.$add(msgObj);
                $scope.messages.push(msgObj);
                $scope.campaign_text = '';

                if ($scope.privateMsgSetupFlag != 1) {
                    NotificationSettings.sendmail($rootScope.formatInputString({
                            sender_id: fromId,
                            receiver_id: toId
                        }))
                        .then(function(res) {
                            if (res.data.status === 1) {}
                        });
                }
            }
        };

        var newMessageArray = [];
        ref.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                if ($scope.privateMsgSetupFlag === 1 && childData.from_id == fromId && childData.to_id == toId) {
                    newMessageArray.push(childData);
                }
                if ($scope.privateMsgSetupFlag === 2 && childData.from_id == fromId) {
                    newMessageArray.push(childData);
                }
            });
            $scope.messages = newMessageArray;
        });


        /* *** Show calory how much user have and given ******** */
        var allId = $stateParams.id || $rootScope.user_id;
        if (allId != null && allId != '' && allId != undefined) {
            localStorage.setItem('allIds_ShowCaloryDetails', allId);
        }
        if (localStorage.getItem('allIds_ShowCaloryDetails')) {
            var allId = localStorage.getItem('allIds_ShowCaloryDetails');
            var data = {
                user_id: allId
            };
            var data = $rootScope.formatInputString(data);
            CaloryHaveOrGiven.calories(data).then(function(response) {
                $scope.total_calorie_given = response.data.result.total_calorie_given;
                $scope.total_calorie_have = response.data.result.total_calorie_have;
            });
        }
        /* *** Show calory how much user have and given ******** */
        $scope.check_campaignId = function() {
            if (localStorage.getItem('campaign_id') == null && localStorage.getItem('campaign_id') == '' && localStorage.getItem('campaign_id') == undefined) {
                toastr.error('Sorry!!You have no active campaign');
                return false;
            }
        };
        if ($rootScope.previousState == "congrats_videoupload") {
            $scope.myProfile = '0';
        }
        if (localStorage.getItem('userInfo')) {
            var userInfo = JSON.parse(localStorage.getItem('userInfo')).userInfo;
            if (userInfo.result.contributor.length > 0 && userInfo.result.campaign.length > 0) {
                $scope.completecampaingstatus = userInfo.result.campaign[0].campaign_status;
                localStorage.setItem('currentSate', 'questions');
                localStorage.setItem('actualState', 'questions');
            }
            if (userInfo.result.campaign.length) {

                $scope.campaign_status = userInfo.result.campaign[0].campaign_status;
                //alert($scope.campaign_status + "1")
                if ($scope.campaign_status == 0) {
                    localStorage.setItem('currentSate', "campaignBrowse");
                    if ($rootScope.previousState == 'questions' || $rootScope.previousState == 'thanksAfterContribution') {
                        $scope.staus_on = true;
                    } else {
                        $scope.staus_on = false;
                    }
                }

            } else {

                if ($scope.campaign_status == 0 || $scope.campaign_status == undefined) {
                    localStorage.setItem('currentSate', "campaignBrowse");
                }
            }
            /** need to apply api */
            if (localStorage.getItem('startnew')) {}
        }
        //alert(localStorage.getItem('startnew'))
        if (localStorage.getItem('actualState')) {
            if (localStorage.getItem('actualState') == 'questions' || localStorage.getItem('actualState') == 'upload-video') {
                if (localStorage.getItem('startnew') == 'active') {
                    if (localStorage.getItem('endCampaign')) {
                        localStorage.removeItem('endCampaign');
                    }
                    $timeout(function() {
                        $rootScope.unCompleteCampaign = 0;
                        $scope.uncompleteStartnew = 1;
                    }, 10);
                }

            }
        }

        if (localStorage.getItem('userInfo')) {
            var userdetails = JSON.parse(localStorage.getItem('userInfo')).userInfo;
            if (userdetails.result.campaign.length) {
                var campaignStat = userdetails.result.campaign[0].campaign_status;
            }
            var profileVideo = userdetails.result.profile_videos.length;
            if (campaignStat == 1 && profileVideo > 0) {
                $scope.unCompleteCampaign = 0;
            }
        }

    });