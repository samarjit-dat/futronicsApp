futronics.controller('contributionCtrl',
    function($scope, StorageService, $state, $rootScope, $window, $localstorage, $ionicPopup,
        $timeout, ionPullUpFooterState, stateFactory, LogoutService,
        ContributionServices, IMAGE, $stateParams, CaloryHaveOrGiven, MotivationPercent) {

        if (localStorage.getItem('userInfo')) {
            var user = JSON.parse(localStorage.getItem('userInfo'));
            if (user.userInfo.result[0].user_id != null || user.userInfo.result[0].user_id != '') {
                var user_id = user.userInfo.result[0].user_id;
            }
            stateFactory.setCurrentState($state.current.name, user_id); // For getting value stateFactory.getCurrentState()
            stateFactory.getCurrentState(user_id);

            if (user.userInfo.result.campaign.length > 0) {
                var campaign_status = user.userInfo.result.campaign[0].campaign_status;
            }
        }

        $scope.showRoller = false;

        if ($rootScope.isMaintain === undefined) {
            $rootScope.isMaintain = null;
        }

        StorageService.storage();
        $scope.contributeButton = false;
        $scope.logout = function() {
            LogoutService.logout();
        };
        if (localStorage.getItem('viewIndividualProfile_globalChat') != null) {

            $scope.otherProfile = 1;
            $scope.individual_user_details = '';
            $scope.individual_user_details = JSON.parse(localStorage.getItem('viewIndividualProfile_globalChat'));

            var user_details = JSON.parse(localStorage.getItem('viewIndividualProfile_globalChat'));

        } else {
            $scope.walletValue = $rootScope.walletValue;
        }

        $rootScope.slidingAmount = 0;
        $scope.roller = { checked: false };
        $rootScope.rollerSteps = 5;

        $rootScope.slider = {
            value: $rootScope.slidingAmount,
            options: {
                floor: 0,
                ceil: 1000,
                step: 5,
                translate: function(value) { return '&dollar;' + value; },
                id: 'slideEnded',
                onEnd: $scope.myEndListener
            }
        }

        $scope.$on("slideEnded", function() {

            if ($rootScope.slider.value > parseInt($scope.walletValue)) {
                $scope.contributeButton = true;
                $ionicPopup.show({
                    template: 'update your current balance before you contribute the selected amount',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [{
                            text: 'Cancel',
                            type: 'button-dark'
                        },
                        {
                            text: '<b>Ok</b>',
                            type: 'button-calm',
                            onTap: function(e) {
                                $state.go("addFund");
                                return;
                            }
                        }
                    ]
                });
            } else {
                $rootScope.slidingAmount = $rootScope.slider.value;
                $scope.contributeButton = false;
            }
        });
        $scope.rollerChange = function() {

            if (!$scope.roller.checked) {
                $rootScope.slider = {

                    value: $rootScope.slidingAmount,
                    options: {
                        floor: 0,
                        ceil: 1000,
                        step: 5,
                        translate: function(value) { return '&dollar;' + value; },
                        id: 'slideEnded',
                        onEnd: $scope.myEndListener
                    }
                };
                $rootScope.latestValue = 1000;
                if ($rootScope.slider.value > 1000) $rootScope.slider.value = 1000;
            } else {
                $rootScope.slider = {

                    value: $rootScope.slidingAmount,
                    options: {
                        floor: 0,
                        ceil: 50000,
                        step: 5,
                        translate: function(value) { return '&dollar;' + value; },
                        id: 'slideEnded',
                        onEnd: $scope.myEndListener
                    }
                };
                $rootScope.latestValue = 50000;
            }
            $scope.showRoller = $scope.roller.checked;
        };

        /* ************ Single_user localStorage Get Data Start************ */
        $scope.single_user = '';
        $scope.single_user = JSON.parse(localStorage.getItem('single_user'));

        if ($scope.single_user.campaign.length > 0) {
            $scope.runningCampaignId = $scope.single_user.campaign[0].campaign_id;
        }
        $rootScope.to_id = $scope.single_user.user_details.user_id;



        MotivationPercent.getPercent($rootScope.formatInputString({ user_id: $scope.single_user.user_details.user_id, campaign_id: $scope.single_user.campaign[0].campaign_id }))
            .then(function(res) {
                $scope.motivation_percentage = Math.round(res.data.result.percentile_amount_collected).toFixed();
            });

        /* ************ Single_user$scope.single_user localStorage Get Data End************ */
        /* *** username and details start *** */
        $scope.myProfile = 0;
        $scope.otherProfile = '';

        $scope.uid = $rootScope.user_id;
        if (localStorage.getItem('otherProfileDetails')) {
            $scope.otheruserId = localStorage.getItem('otherProfileDetails');
        }
        if (localStorage.getItem('myProfile') != null) {
            $scope.totalCampaign = '';
            $scope.myProfile = 0;
        } else {
            $scope.totalCampaign = 0;
            $scope.myProfile = 1;
        }
        /* *** username and details end *** */

        /*** Thanks contribution start*** */


        if ($rootScope.isMaintain == null || $rootScope.isMaintain == '' || $rootScope.isMaintain == undefined) {
            $rootScope.isMaintain = 'false';
        }

        $scope.goToThanksContribution = function() {
            if ($rootScope.slidingAmount == 0) {
                $ionicPopup.show({
                    template: 'You are not select amount yet',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [{
                        text: 'Ok',
                        type: 'button-calm'

                    }]
                });
            } else {
                if ($rootScope.isMaintain == 'false') {
                    var data = {
                        form_id: $rootScope.user_id,
                        to_id: $rootScope.to_id,
                        contributed_amount: $rootScope.slider.value,
                        contributed_user_campaign_id: $scope.runningCampaignId
                    };
                } else {
                    if (localStorage.getItem('maintainId'))
                        var maintainId = localStorage.getItem('maintainId');
                    var data = {
                        user_id: $rootScope.user_id,
                        contributed_id: $rootScope.to_id,
                        contributed_amount: $rootScope.slider.value,
                        maintence_id: maintainId
                    };
                }

                var data = $rootScope.formatInputString(data);
                ContributionServices.contribute(data).then(function(response) {
                    if ($rootScope.isMaintain == 'false') {
                        var campaign_id = response.data.result.my_campaign_id;
                        if (response.data.result.contributor.length != 0) {
                            var ohter_user_campaign_id = response.data.result.contributor[0].campaign_id;
                            localStorage.setItem('ohter_user_campaign_id', ohter_user_campaign_id);
                        }
                        if (localStorage.getItem('userInfo')) {
                            var user = JSON.parse(localStorage.getItem('userInfo'));
                            if (user.userInfo.result.campaign[0].campaign_status != 1) {
                                localStorage.setItem('myCampaignId', campaign_id);
                                localStorage.setItem('campaign_id', campaign_id);
                                localStorage.setItem('thanks_contribution_amount', $rootScope.slidingAmount);
                            }
                        }
                        $state.go('thanksAfterContribution', { id: $stateParams.id, already_contributed: response.data.result.if_already_contributed });
                    } else {
                        localStorage.setItem('thanks_contribution_amount', $rootScope.slidingAmount);

                        $state.go('thanksAfterContribution', { id: $stateParams.id, already_contributed: response.data.result.if_already_contributed });
                    }
                });


            }
        };

        /* *** Show calory how much user have and given ******** */
        var allId = $stateParams.id;
        if (allId != null && allId != '' && allId != undefined) {
            localStorage.setItem('allIds_ShowCaloryDetailsContribution', allId);
        }
        if (localStorage.getItem('allIds_ShowCaloryDetailsContribution')) {
            var allId = localStorage.getItem('allIds_ShowCaloryDetailsContribution');
            var data = {
                user_id: allId
            };
            var data = $rootScope.formatInputString(data);
            CaloryHaveOrGiven.calories(data).then(function(response) {
                $scope.total_calorie_given = response.data.result.total_calorie_given;
                $scope.total_calorie_have = response.data.result.total_calorie_have;
            });
        }

        $scope.user_list = function() {
            $state.go('campaignBrowse');
        };
        $scope.myContribution = function() {
            $state.go('myContribution');
        };

        if ($localstorage.get('signup')) {
            $scope.chekSignup = $localstorage.get('signup');
        }
        /* *** Show calory how much user have and given ******** */

    });