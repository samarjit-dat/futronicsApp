futronics.controller('accountSettingsCtrl',
    function($scope, StorageService, $ionicPopup, $rootScope,
        AccountService, Loader, $state, $localstorage, endcampaign,
        TimeAndDateFactory, HideCampaign, MaintainService, ShowCampaign, check_hideOrShow,
        AfterEndCampaign, FingerprintServices, stateFactory, $cordovaTouchID,
        NotificationSettings, $ionicModal, EndCampaignStatus, StartNewCampaign,
        SetHideOrShowActive, $timeout) {
        /* ******************** UserId from LocalStorage start***********************  */
        if (localStorage.getItem('userInfo')) {
            var user = JSON.parse(localStorage.getItem('userInfo'));
            if (user.userInfo.result[0].user_id != null || user.userInfo.result[0].user_id != '') {
                var user_id = user.userInfo.result[0].user_id;
            }
            stateFactory.setCurrentState($state.current.name, user_id); // For getting value stateFactory.getCurrentState()
        }
        $scope.isMaintainPhase = localStorage.isMaintainPhase;
        $scope.isMaintainPhaseButton = localStorage.isMaintainPhaseButton;
        if (localStorage.getItem("disableStartnewcampaign")) {
            $scope.startnewcampaign_disable = localStorage.getItem("disableStartnewcampaign");
        }
        StorageService.storage();

        /*** GET 'hideShowCampaign' 0/1 SET LOCALSTORAGE */
        var campaign_id = localStorage.getItem('campaign_id');
        if ($rootScope.isMaintain == 'false') {
            var data = {
                user_id: $rootScope.userId,
                campaign_id: campaign_id

            };
        } else {
            if (localStorage.getItem('maintainId'))
                var maintainId = localStorage.getItem('maintainId');
            var data = {
                user_id: $rootScope.userId,
                maintenance_id: maintainId
            };
        }

        var data = $rootScope.formatInputString(data);
        SetHideOrShowActive.hide_show_get(data).then(function(response) {
            $scope.C_show = '';
            $scope.C_hide = '';
            if (response.data.status == 2 && response.data.result.campaign_status == 2) {
                $localstorage.set('hideShowCampaign', 0);
                var user_info = JSON.parse(localStorage.getItem("userInfo"));
                user_info.userInfo.result.campaign[0].campaign_status = "2";
                var update_userInfo = JSON.stringify(user_info);
                localStorage.setItem("userInfo", update_userInfo);
                $scope.C_show = 1;
                $scope.C_hide = 1;
                $scope.callback();
            }
            if (response.data.status == 2 && response.data.result.campaign_status == 1) {
                localStorage.setItem('hideShowCampaign', 1);
                var user_info = JSON.parse(localStorage.getItem("userInfo"));
                user_info.userInfo.result.campaign[0].campaign_status = "1";
                var update_userInfo = JSON.stringify(user_info);
                localStorage.setItem("userInfo", update_userInfo);
                $scope.C_hide = 0;
                $scope.C_show = 0;
                $scope.callback();
            }
        });


        /*** GET 'hideShowCampaign' 0/1 SET LOCALSTORAGE */

        $scope.backToPrev = function() {
            if ($rootScope.previousState == 'profile') {
                $state.go('profile');
            } else if ($rootScope.previousState == 'globalChat') {
                $state.go('globalChat');
            } else {
                $state.go('globalChat');
            }
        };
        $ionicModal.fromTemplateUrl('notification.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.notification_modal = modal;
            $scope.notification_modal.checked_data = [{
                name: 'Email Notification',
                checked: false
            }, {
                name: 'Text Message Notification',
                checked: true
            }];
        });

        NotificationSettings.get($rootScope.formatInputString({ user_id: $rootScope.userId || $rootScope.user_id })).then(function(res) {

            email_noti = res.data.result.email;
            text_msg_noti = res.data.result.text_msg;

            $scope.notification_modal.checked_data = [{
                name: 'Email Notification',
                checked: email_noti == 1 ? true : false
            }, {
                name: 'Text Message Notification',
                checked: text_msg_noti == 1 ? true : false
            }];
        });

        $scope.closeModal = function() {
            $scope.notification_modal.hide();
        };

        $scope.saveNotiSettings = function() {
            NotificationSettings.set($rootScope.formatInputString({
                    user_id: $rootScope.userId || $rootScope.user_id,
                    email_stat: $scope.notification_modal.checked_data[0].checked ? 1 : 0,
                    txt_msg_stat: $scope.notification_modal.checked_data[1].checked ? 1 : 0
                }))
                .then(function(res) {
                    $scope.notification_modal.hide();
                });
        };
        var count = 0;
        $scope.updateStatus = function(index, status) {
            $scope.notification_modal.checked_data[index].checked = status;

            for (var i = 0; i < $scope.notification_modal.checked_data.length; i++) {
                if ($scope.notification_modal.checked_data[i].checked == false) {
                    count = count + 1;
                    if (count == $scope.notification_modal.checked_data.length) {
                        $scope.checked = false;
                        count = 0;
                    }
                } else {
                    $scope.checked = true;
                }
            }
        };

        $scope.openNotificationModal = function() {
            $scope.notification_modal.show();
        };

        $scope.endCampaignStats = 1;
        $scope.endCampaign = 0;
        if (localStorage.getItem('startnew')) {
            $scope.endCampaignStats = 1;
            $scope.endCampaign = 0;
        }
        $scope.campaign_id = localStorage.getItem('campaign_id');

        if ($rootScope.isMaintain == 'false') {
            var data = {
                user_id: $rootScope.userId,
                campaign_id: $scope.campaign_id
            };
        } else {
            if (localStorage.getItem('maintainId'))
                var maintainId = localStorage.getItem('maintainId');
            var data = {
                user_id: $rootScope.userId,
                maintence_id: maintainId
            };
        }
        var data = $rootScope.formatInputString(data);




        AfterEndCampaign.afterEndCampaignSetValues(data).then(function(response) {
            console.log('AfterEndCampaign')
            console.log(response)
            if (response.data.status == 1) {
                if ($rootScope.campaign_status == 0) {
                    $scope.endCampaignStats = response.data.result.endCampaignStats;
                    $scope.endCampaign = response.data.result.endCampaign;
                }
                if ($rootScope.campaign_status == 1 || $rootScope.campaign_status == 2) {
                    $scope.endCampaignStats = 1;
                    $scope.endCampaign = 0;
                    if ($localstorage.get('hideShowCampaign')) {
                        if ($localstorage.get('hideShowCampaign') == 1) {
                            $scope.C_hide = 0;
                            $scope.C_show = 0;
                        } else {
                            $scope.C_hide = 1;
                            $scope.C_show = 1;
                        }

                    }
                }
            } else {
                toastr.error('Something going wrong,try again');
                return false;
            }
        });

        $scope.endCampaignStatus = $rootScope.endCampaignStatus;

        if ($rootScope.campaign_status == 2) {
            $scope.hide = 2;
        }
        if ($rootScope.campaign_status == 1) {
            $scope.show = 1;
        }

        $scope.viewStats = function() {
            if (!$rootScope.userId || $rootScope.userId == undefined) {
                $ionicPopup.show({
                    template: 'Please Login to view your stats',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [{
                        text: 'Ok',
                        type: 'button-calm',
                        onTap: function(e) {
                            StorageService.storage();
                            $state.go('login');
                            return;

                        }
                    }]
                });
            } else {
                $state.go('profileViewStats');
            }

        };
        if (localStorage.getItem('campaign_duration') !== null) {
            $scope.campaign_duration = localStorage.getItem('campaign_duration');
        } else {
            $scope.campaign_duration = 0;
        }


        /* ******************** UserId from LocalStorage end***********************  */
        $scope.end_campaign = function() {
                $scope.disable_btn = 1;
                if (!$rootScope.userId || $rootScope.userId == undefined) {

                    $ionicPopup.show({
                        template: 'Please Login to participate in campaign',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-calm',
                            onTap: function(e) {
                                StorageService.storage();
                                $state.go("login");
                                return;

                            }
                        }]
                    });
                } else if ($rootScope.campaign_status == 0) {
                    $ionicPopup.show({
                        template: 'Your campaign already ended',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
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
                        template: 'IF YOU END YOUR CAMPAIGN,you will be penalized 5% from Diet Money,and if your \n\
            campaign was already funded,the Contributors will be paid out ',
                        title: '<p style="color:black"><b>End Campaign</b></p>',
                        scope: $scope,
                        buttons: [{
                                text: 'No',
                                type: 'button-dark',
                                onTap: function(e) {
                                    $scope.disable_btn = 0;
                                }
                            },
                            {
                                text: 'Yes',
                                type: 'button-calm',

                                onTap: function(e) {
                                    if ($rootScope.user.userInfo.result.campaign.length == 0) {
                                        $ionicPopup.show({
                                            template: 'You have no campaign active right now',
                                            title: '<p style="color:black"><b>Attention!!!</b></p>',
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

                                        Loader.showLoading();
                                        if ($rootScope.isMaintain == 'false') {
                                            var data = {
                                                campain_start_date: $rootScope.campaign_date[0],
                                                campain_close_requested_day_date: TimeAndDateFactory.getTodayDate(),
                                                user_id: $rootScope.userId,
                                                campaign_id: $scope.campaign_id,
                                                endCampaignStats: $scope.endCampaignStats,
                                                endCampaign: $scope.endCampaign

                                            };
                                        } else {
                                            if (localStorage.getItem('maintainStartDate'))
                                                var maintain_start_date = localStorage.getItem('maintainStartDate');

                                            if (localStorage.getItem('maintainId'))
                                                var maintainId = localStorage.getItem('maintainId');
                                            var data = {
                                                maintence_start_date: maintain_start_date,
                                                maintence_close_requested_day_date: TimeAndDateFactory.getTodayDate(),
                                                user_id: $rootScope.userId,
                                                maintence_id: maintainId,
                                                endCampaignStats: $scope.endCampaignStats,
                                                endCampaign: $scope.endCampaign
                                            };
                                        }
                                        var data = $rootScope.formatInputString(data);
                                        Loader.hideLoading();
                                        $scope.disable_btn = 0;
                                        endcampaign.userEndCampaign(data).then(function(response) {

                                            if (response.data.status == 0) {

                                                localStorage.setItem('showGlobalChat_afterEndCampaign', '_1');
                                                localStorage.removeItem('campaignCompleteOrNot');
                                                var param = {
                                                    user_id: $rootScope.user_id || $rootScope.userId,
                                                    campaign_id: $scope.campaign_id,
                                                    end_campaign_status: "true"
                                                };
                                                var data = $rootScope.formatInputString(param);

                                                EndCampaignStatus.post(data).then(function(response) {
                                                    if (response.data.status == 2)
                                                        localStorage.setItem('endcampaign', "success");
                                                });

                                                $scope.endCampaign = 1;
                                                $scope.endCampaignStats = 0;
                                                $ionicPopup.show({
                                                    template: 'You successfully end your campaign',
                                                    title: '<p style="color:black"><b></b></p>',
                                                    scope: $scope,
                                                    buttons: [{
                                                        text: 'Ok',
                                                        type: 'button-calm',
                                                        onTap: function(e) {
                                                            if (localStorage.isMaintainPhase == 'true') {
                                                                localStorage.isMaintainPhase = false;
                                                                localStorage.isMaintainPhaseButton = false;
                                                            }
                                                            $state.go('endCampaignProfile');
                                                            return;
                                                        }
                                                    }]
                                                });

                                            } else {
                                                $ionicPopup.show({
                                                    template: 'Something went wrong.Try again',
                                                    title: '<p style="color:black"><b>Sorry!!!</b></p>',
                                                    scope: $scope,
                                                    buttons: [{
                                                        text: 'Ok',
                                                        type: 'button-calm'

                                                    }]
                                                });
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
            /* *********************** News Feed Toggle Start******************************* */


        if ($localstorage.get('newsFeed')) {
            if ($localstorage.get('newsFeed') == 0) {
                $rootScope.showDivider = $scope.newsOn = 0;
                $scope.newsOff = 0;
            } else {
                $scope.newsOff = 1;
                $scope.newsOn = 1;
            }
        } else {
            $scope.newsOff = 0;
        }

        if ($localstorage.get('fingerprints')) {
            if ($localstorage.get('fingerprints') == 0) {
                $rootScope.showDivider = $scope.fingerprintOn = 0;
                $scope.fingerprintOff = 0;
            } else {
                $scope.fingerprintOff = 1;
                $scope.fingerprintOn = 1;
            }
        } else {
            $scope.fingerprintOn = 1;
        }
        if (localStorage.getItem('isMaintainPhaseButton'))
            var maintain = localStorage.getItem('isMaintainPhaseButton');
        if ($rootScope.isMaintain == 'false' || maintain == 'false' || $rootScope.isMaintain == undefined) {
            var data = {
                user_id: $rootScope.userId,
                campaign_id: $scope.campaign_id
            };
        } else {
            if (localStorage.getItem('maintainId'))
                var maintainId = localStorage.getItem('maintainId');
            var data = {
                user_id: $rootScope.userId,
                maintence_id: maintainId
            };
        }
        var data = $rootScope.formatInputString(data);
        $scope.callback = function() {

            if (localStorage.getItem('userInfo')) {
                var user = JSON.parse(localStorage.getItem('userInfo'));
                if (user.userInfo.result.campaign.length > 0) {
                    $scope.campaign_status = user.userInfo.result.campaign[0].campaign_status;

                    if ($scope.campaign_status == 1) {
                        check_hideOrShow.hideShowLocalStorageValue(data).then(function(response) {

                            if (response.data.result.weight_loss_hide_show_status == 0) {
                                $scope.endCampaign == 1;
                            }
                            if (response.data.status == 1) {

                                if ($localstorage.get('hideShowCampaign')) {
                                    if ($localstorage.get('hideShowCampaign') == 0) {
                                        $scope.C_hide = 1;
                                        $scope.C_show = 1;
                                    } else {
                                        $scope.C_hide = 0;
                                        $scope.C_show = 0;
                                    }
                                } else {
                                    $scope.C_hide = 0;
                                }
                            }

                        });
                    }
                } else {
                    $scope.campaign_status = 0;
                }
            }

        };



        $scope.newsFeed = function(data) {
            $rootScope.showDivider = data;
            if (data == 1) {
                $localstorage.set('newsFeed', 0);
                $scope.newsOff = 0;
                $scope.newsOn = 0;
            } else {
                $localstorage.set('newsFeed', 1);
                $scope.newsOn = 1;
                $scope.newsOff = 1;
            }
        }

        function fingerprintFn(data) {
            FingerprintServices.registerToken(data)
                .then(function(res) {})
                .catch(function(err) {});
        }

        $scope.fingerPrint = function(data) {
                $rootScope.showDivider = data;
                if (data == 1) {
                    if (ionic.Platform.isAndroid()) {
                        FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);
                    }

                    function isAvailableSuccess(result) {
                        console.log("FingerprintAuth available: " + JSON.stringify(result));
                        if (result.isAvailable) {
                            // var encryptConfig = {}; // See config object for required parameters
                            var encryptConfig = {
                                clientId: "cordova-chatapp",
                                username: "dakshesh",
                                password: "daksh@123"
                            };
                            FingerprintAuth.encrypt(encryptConfig, encryptSuccessCallback, encryptErrorCallback);
                        }
                    }

                    function isAvailableError(message) {
                        console.log("isAvailableError(): " + message);
                    }

                    function encryptSuccessCallback(result) {

                        console.log("successCallback(): " + JSON.stringify(result));
                        if (result.withFingerprint) {
                            console.log("Successfully encrypted credentials.");
                            console.log("Encrypted credentials: " + result.token);

                            fingerprintFn($rootScope.formatInputString({
                                user_id: $rootScope.user_id || $rootScope.userId,
                                token: result.token
                            }));
                        } else if (result.withBackup) {
                            console.log("Authenticated with backup password");
                        }
                    }

                    function encryptErrorCallback(error) {
                        if (error === "Cancelled") {
                            console.log("FingerprintAuth Dialog Cancelled!");
                        } else {
                            console.log("FingerprintAuth Error: " + error);
                        }
                    }

                    if (ionic.Platform.isIOS()) {
                        window.plugins.touchid.isAvailable(
                            function() {
                                // alert('available!');
                                window.plugins.touchid.verifyFingerprint(
                                    'Scan your fingerprint please', // this will be shown in the native scanner popup
                                    function(msg) {
                                        alert('ok: ' + msg);
                                    }, // success handler: fingerprint accepted
                                    function(msg) {
                                        alert('Something is wrong: ' + JSON.stringify(msg));
                                    } // error handler with errorcode and localised reason
                                );
                            }, // success handler: TouchID available
                            function(msg) {
                                alert('not available, message: ' + msg)
                            } // error handler: no TouchID available
                        );
                    }
                    $localstorage.set('fingerprints', 0);
                    $scope.fingerprintOff = 0;
                    $scope.fingerprintOn = 0;
                } else {
                    $localstorage.set('fingerprints', 1);
                    $scope.fingerprintOn = 1;
                    $scope.fingerprintOff = 1;
                }
            }
            /* *********************** News Feed Toggle End******************************* */


        /* ************************ HIDE CAMPAIGN START************************************ */
        $scope.hideCampaign = function(v) {

            $scope.disable_btn = 1;
            $scope.user1 = JSON.parse(localStorage.getItem('userInfo'));
            if (!$rootScope.userId || $rootScope.userId == undefined) {
                $ionicPopup.show({
                    template: 'Please Login to participate in campaign',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [{
                        text: 'Ok',
                        type: 'button-calm',
                        onTap: function(e) {
                            StorageService.storage();
                            $state.go("login");
                            return;

                        }
                    }]
                });
            } else if ($scope.user1.userInfo.result.campaign[0].campaign_status == 2) {
                Loader.showLoading();
                if ($rootScope.user.userInfo.result.campaign.length == 0) {
                    $ionicPopup.show({
                        template: 'You have no campaign active right now',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
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
                    var hide_show;
                    if (v == 1) {
                        hide_show = 0;
                    } else {
                        hide_show = 1;
                    }
                    if ($rootScope.isMaintain == 'false') {
                        var data = {
                            campain_start_date: $rootScope.campaign_date[0],
                            campain_show_requested_day_date: TimeAndDateFactory.getTodayDate(),
                            user_id: $rootScope.userId,
                            campaign_id: $scope.campaign_id,
                            hideshowcampaign: hide_show
                        };
                    } else {

                        if (localStorage.getItem('maintainStartDate'))
                            var maintain_start_date = localStorage.getItem('maintainStartDate');

                        if (localStorage.getItem('maintainId'))
                            var maintainId = localStorage.getItem('maintainId');
                        var data = {
                            maintence_start_date: maintain_start_date,
                            maintence_show_requested_day_date: TimeAndDateFactory.getTodayDate(),
                            user_id: $rootScope.userId,
                            maintence_id: maintainId,
                            hideshowcampaign: hide_show
                        };
                    }
                    var data = $rootScope.formatInputString(data);
                    ShowCampaign.userShowCampaign(data).then(function(response) {

                        Loader.hideLoading();
                        $scope.disable_btn = 0;
                        if (response.data.campaign_status == "1") {
                            $ionicPopup.show({
                                template: 'Your campaign is shown now',
                                title: '<p style="color:black"><b>Hide Campaign</b></p>',
                                scope: $scope,
                                buttons: [{
                                    text: 'Ok',
                                    type: 'button-calm'

                                }]
                            });
                        }
                        if (v == 1) {
                            if ($rootScope.isMaintain == 'false') {
                                var data = {
                                    user_id: $rootScope.userId,
                                    campaign_id: $scope.campaign_id,
                                    hideShowCampaign: 0
                                };
                            } else {

                                if (localStorage.getItem('maintainId'))
                                    var maintainId = localStorage.getItem('maintainId');
                                var data = {
                                    user_id: $rootScope.userId,
                                    maintenance_id: maintainId,
                                    hideShowCampaign: 0
                                };
                            }

                            var data = $rootScope.formatInputString(data);
                            SetHideOrShowActive.hide_show_post(data).then(function(response) {
                                $localstorage.set('hideShowCampaign', 0);
                                $scope.C_hide = 0;
                                $scope.C_show = 0;
                            });


                        } else {

                            if ($rootScope.isMaintain == 'false') {
                                var data = {
                                    user_id: $rootScope.userId,
                                    campaign_id: $scope.campaign_id,
                                    hideShowCampaign: 1
                                };
                            } else {


                                if (localStorage.getItem('maintainId'))
                                    var maintainId = localStorage.getItem('maintainId');
                                var data = {
                                    user_id: $rootScope.userId,
                                    maintenance_id: maintainId,
                                    hideShowCampaign: 1
                                };
                            }

                            var data = $rootScope.formatInputString(data);
                            SetHideOrShowActive.hide_show_post(data).then(function(response) {
                                $localstorage.set('hideShowCampaign', 1);
                                $scope.C_hide = 1;
                                $scope.C_show = 1;
                            });

                        }
                    });

                }

            } else if ($scope.user1.userInfo.result.campaign[0].campaign_status == 0) {
                $ionicPopup.show({
                    template: 'Your campaign already ended',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
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
                    template: "If you hide your campaign, it will stay active, but people won't be able to see it or contribute to it yet.  If you are funded and the campaign is running, the users won't be able to leave you comments.  But, will be able to see your progress through your video uploads. ",
                    title: '<p style="color:black"><b>Hide Campaign</b></p>',
                    scope: $scope,
                    buttons: [{
                            text: 'No',
                            type: 'button-dark',
                            onTap: function(e) {
                                $scope.disable_btn = 0;
                            }
                        },
                        {
                            text: 'Yes',
                            type: 'button-calm',

                            onTap: function() {

                                if ($scope.user1.userInfo.result.campaign.length == 0) {
                                    $ionicPopup.show({
                                        template: 'You have no campaign active right now',
                                        title: '<p style="color:black"><b>Attention!!!</b></p>',
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
                                    Loader.showLoading();
                                    var hide_show;
                                    if (v == 1) {
                                        hide_show = 0;
                                    } else {
                                        hide_show = 1;
                                    }
                                    if ($rootScope.isMaintain == 'false') {
                                        var data = {
                                            campain_start_date: $rootScope.campaign_date[0],
                                            campain_hide_requested_day_date: TimeAndDateFactory.getTodayDate(),
                                            user_id: $rootScope.userId,
                                            campaign_id: $scope.campaign_id,
                                            hideshowcampaign: hide_show
                                        };
                                    } else {
                                        if (localStorage.getItem('maintainStartDate'))
                                            var maintain_start_date = localStorage.getItem('maintainStartDate');

                                        if (localStorage.getItem('maintainId'))
                                            var maintainId = localStorage.getItem('maintainId');
                                        var data = {
                                            maintence_start_date: maintain_start_date,
                                            maintence_hide_requested_day_date: TimeAndDateFactory.getTodayDate(),
                                            user_id: $rootScope.userId,
                                            maintence_id: maintainId,
                                            hideshowcampaign: hide_show
                                        };
                                    }
                                    var data = $rootScope.formatInputString(data);
                                    HideCampaign.userHideCampaign(data).then(function(response) {

                                        Loader.hideLoading();
                                        $scope.disable_btn = 0;
                                        if (response.data.message == "Your campaign hide successfully.") {
                                            $ionicPopup.show({
                                                template: 'Your campaign is hidden',
                                                title: '<p style="color:black"><b>Hide Campaign</b></p>',
                                                scope: $scope,
                                                buttons: [{
                                                    text: 'Ok',
                                                    type: 'button-calm'

                                                }]
                                            });
                                        }
                                        if (v == 1) {

                                            if ($rootScope.isMaintain == 'false') {
                                                var data = {
                                                    user_id: $rootScope.userId,
                                                    campaign_id: $scope.campaign_id,
                                                    hideShowCampaign: 0
                                                };
                                            } else {
                                                if (localStorage.getItem('maintainId'))
                                                    var maintainId = localStorage.getItem('maintainId');
                                                var data = {
                                                    user_id: $rootScope.userId,
                                                    maintenance_id: maintainId,
                                                    hideShowCampaign: 0
                                                };
                                            }

                                            var data = $rootScope.formatInputString(data);
                                            SetHideOrShowActive.hide_show_post(data).then(function(response) {
                                                $localstorage.set('hideShowCampaign', 0);
                                                $scope.C_hide = 0;
                                                $scope.C_show = 0;
                                            });

                                        } else {

                                            if ($rootScope.isMaintain == 'false') {
                                                var data = {
                                                    user_id: $rootScope.userId,
                                                    campaign_id: $scope.campaign_id,
                                                    hideShowCampaign: 1
                                                };
                                            } else {

                                                if (localStorage.getItem('maintainId'))
                                                    var maintainId = localStorage.getItem('maintainId');
                                                var data = {
                                                    user_id: $rootScope.userId,
                                                    maintenance_id: maintainId,
                                                    hideShowCampaign: 1
                                                };
                                            }

                                            var data = $rootScope.formatInputString(data);
                                            SetHideOrShowActive.hide_show_post(data).then(function(response) {
                                                $localstorage.set('hideShowCampaign', 1);
                                                $scope.C_hide = 1;
                                                $scope.C_show = 1;
                                            });

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

        $scope.wouldUWantToStartCampaign = function() {
            $ionicPopup.show({
                template: 'Would you like to restart a campaign now?',
                title: '<p style="color:black"><b>Your campaign already ended</b></p>',
                scope: $scope,
                buttons: [{
                    text: 'Back',
                    type: 'button-dark',
                    onTap: function(e) {
                        return;
                    }
                }, {
                    text: 'Ok',
                    type: 'button-calm',
                    onTap: function(e) {
                        startNewCampaign();
                        return;
                    }
                }]
            });
        }

        function startNewCampaign() {
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
                }]

            });

        }

        if (localStorage.getItem('userInfo')) {
            var userInfo = JSON.parse(localStorage.getItem('userInfo')).userInfo;

            if (userInfo.result.campaign.length == 0) {
                $scope.viewStatsDisabled = true;
            }
        }
    });