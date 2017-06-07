futronics.controller('profile-endcampaignCtrl', function($scope, StorageService,
    check_GlobalCommunity, $state, $rootScope, AccountService, $localstorage, $ionicModal, $sce,
    $ionicPopup, $timeout, ionPullUpFooterState, StartNewCampaign,
    $location, IMAGE, stateFactory, MotivationPercent) {

    stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
    $ionicModal.fromTemplateUrl('videoModalScript.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal_video = modal;
    });

    $scope.mainImage = '';

    StorageService.storage();
    $scope.checkMember = function() {
        check_GlobalCommunity.check_memberOrNot();
    }

    $scope.open_web_for_information = function() {
        window.open('http://www.google.com', '_system', 'location=yes');
    };
    var imgObj = [];

    if (localStorage.getItem('viewIndividualProfile_globalChat') != null) {

        $scope.otherProfile = 1;
        $scope.myProfile = 0;
        $scope.individual_user_details = '';

        $scope.individual_user_details = JSON.parse(localStorage.getItem('viewIndividualProfile_globalChat'));

        /*******************************Image push start************************************/

        $scope.individual_user_details.profile_images.forEach(function(ele) {
            var requiredParams = [];
            var imageStr = ele.profile_image;
            requiredParams['profile_image'] = imageStr;
            imgObj.push(requiredParams);
        });
        $scope.individual_user_details.profile_videos.forEach(function(ele) {
            var requiredParams = [];
            var videoThumbUrlbStr = ele.thumb_url;
            var videoUrlStr = ele.video_url;
            requiredParams['thumb_url'] = videoThumbUrlbStr;
            requiredParams['video_url'] = videoUrlStr;
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

            if (imgObj[0]['profile_image']) {
                $scope.mainImage = imgObj[0]['profile_image'];
            } else if (imgObj[0]['thumb_url']) {
                $scope.mainImage = imgObj[0]['thumb_url'];
            }
        } else {
            $scope.mainImage = IMAGE.BASE_IMAGE;
        }

        /*******************************Image push end************************************/
    }

    /* *** username and details end *** */


    /************************** video open on modal **************************************/
    $scope.openMainImageVideoModal = function() {
        var profileImagesDomEle = angular.element(document.querySelector('#profileMainImage'));
        $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(profileImagesDomEle[0].alt);
        if (profileImagesDomEle[0].alt !== '' && profileImagesDomEle[0].alt !== 'undefined') {
            $scope.modal_video.show();
        } else {
            $scope.modal_video.hide();
        }
    }
    $scope.openVideoModal = function(video_url) {
        $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(video_url);
        $scope.modal_video.show();
    }

    $scope.closeModal = function() {
        $scope.modal_video.hide();
    }

    /*************** Start New Campaign ************************/

    $scope.startNew = function() {
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
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-calm',
                    onTap: function(e) {
                        if ($scope.slider.value == 0) {
                            toastr.error('Motivation value should be greater than 0');
                            return false;
                        }

                        StartNewCampaign.isActive($rootScope.formatInputString({ user_id: $rootScope.userId || $rootScope.user_id }))
                            .then(function(res) {
                                if (res.data.status === 2) {
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
                }
            ]

        });

    }

    /**** Show Progress percentage logged In user start*********** */
    if (localStorage.getItem('userInfo')) {
        if ($rootScope.user_details.userInfo.result.campaign.length) {
            MotivationPercent.getPercent($rootScope.formatInputString({ user_id: $rootScope.user_id || $rootScope.userId, campaign_id: $rootScope.user_details.userInfo.result['campaign'][0]['campaign_id'] }))
                .then(function(res) {
                    $scope.motivation_percentage = Math.round(res.data.result.percentile_amount_collected).toFixed();
                })
        }

    }
    /**** Show Progress percentage logged In user end*********** */

    /***************************** video open on modal ************************************/

    /* *****  user own profle start **** */

    if (localStorage.getItem('myProfile') != null) {

        $scope.totalCampaign = '';
        $scope.myProfile = 0;
        $scope.my_details = '';
        $scope.my_details = JSON.parse(localStorage.getItem('userInfo'));

        $scope.my_details.userInfo.result.profile_images.forEach(function(ele) {
            var requiredParams = [];
            var imageStr = ele.profile_image;
            requiredParams['profile_image'] = imageStr;
            imgObj.push(requiredParams);
        });
        $scope.my_details.userInfo.result.profile_videos.forEach(function(ele) {
            var requiredParams = [];
            var videoThumbUrlbStr = ele.thumb_url;
            var videoUrlStr = ele.video_url;
            requiredParams['thumb_url'] = videoThumbUrlbStr;
            requiredParams['video_url'] = videoUrlStr;
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

            if (imgObj[0]['profile_image']) {
                $scope.mainImage = imgObj[0]['profile_image'];
            } else if (imgObj[0]['thumb_url']) {
                $scope.mainImage = imgObj[0]['thumb_url'];
            }
        } else {
            $scope.mainImage = IMAGE.BASE_IMAGE;
        }
        if ($scope.my_details.userInfo.result.campaign == []) {
            $scope.totalCampaign = 0;
        }

    } else {
        $scope.totalCampaign = 0;
        $scope.myProfile = 1;
    }

    $scope.user_list = function() {
        $state.go('campaignBrowse');
    };

    $scope.myContribution = function() {
        $state.go('myContribution');
    };
});