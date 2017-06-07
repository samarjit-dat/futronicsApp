futronics.controller('thanksAfterContributionCtrl',
    function($scope, $rootScope, StorageService, $state,
        check_GlobalCommunity, $localstorage, LogoutService, stateFactory, MotivationPercent,
        $ionicPopup, AccountService, $firebaseArray, $stateParams, CaloryHaveOrGiven) {

        if (localStorage.getItem('userInfo')) {

            var user = JSON.parse(localStorage.getItem('userInfo'));
            if (user.userInfo.result[0].user_id != null || user.userInfo.result[0].user_id != '') {
                var user_id = user.userInfo.result[0].user_id;
            }
            stateFactory.setCurrentState($state.current.name, user_id); // For getting value stateFactory.getCurrentState()
            stateFactory.getCurrentState(user_id);
        }
        /* ************ thanks_contribution_amount localStorage Get Data Start************ */
        StorageService.storage();
        $scope.logout = function() {
            LogoutService.logout();
        };
        $scope.contribution_amount = '';
        $scope.contribution_amount = localStorage.getItem('thanks_contribution_amount');


        if ($rootScope.isMaintain === undefined) {
            $rootScope.isMaintain = null;
        }

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

        /* *** Show calory how much user have and given ******** */
        var allId = $stateParams.id;
        if (allId != null && allId != '' && allId != undefined) {
            localStorage.setItem('allIds_ShowCaloryDetailsThanksContribution', allId);
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

        /* ************ thanks_contribution_amount localStorage Get Data End************ */

        /* ************ Single_user localStorage Get Data Start************ */
        $scope.single_user = '';
        $scope.single_user = JSON.parse(localStorage.getItem('single_user'));

        /* ************ Single_user$scope.single_user localStorage Get Data End************ */
        $scope.checkMember = function() {
            check_GlobalCommunity.check_memberOrNot();
        };
        $scope.startQuestion = function() {
            $localstorage.set('StartQuestion', '1');
            $state.go('questions');
        };
        $scope._uid = $rootScope.user_id;
        $scope.myOwnProfile = function() {
            localStorage.removeItem('viewIndividualProfile_globalChat');
            StorageService.storage();
            $scope.ctrlRegister.close();
            localStorage.setItem('myProfile', '1');
            $state.go('profile');
        }
        var user = JSON.parse(localStorage.getItem('userInfo'));

        if (user.userInfo.result.campaign.length != 0) {
            $scope.campaign_status = user.userInfo.result.campaign[0].campaign_status;

            if ($rootScope.previousState == 'contribution') {
                $scope.$on('$ionicView.enter', function() {
                    $scope.ctrlRegister = $ionicPopup.show({
                        templateUrl: 'thanksModal.html',
                        scope: $scope,
                        cssClass: "thanks-msg",
                        buttons: [{
                            text: '<i class="icon ion-close-circled"></i>',
                            type: 'popclose',
                            onTap: function(e) { return; }
                        }]
                    });
                });
            }
        }

        $scope.messages = [];
        var ref = firebase.database().ref().child("chat").child("private");

        $scope.myContribution = function() {
            $state.go('myContribution');
        };

        $scope.checkMember = function() {
            check_GlobalCommunity.check_memberOrNot();
        };

        $scope.userdata = AccountService.getUserInfo();

        /**
         * Firebase adding functionlity
         */

        var msgRef = $firebaseArray(ref);
        $scope.messages = $firebaseArray(ref);
        var fromUserInfo = $scope.userdata.userInfo;

        var fromId = fromUserInfo.result[0].user_id;
        var toId = $scope.single_user.user_details.user_id;

        var newMessageArray = [];
        ref.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.to_id == toId) {
                    newMessageArray.push(childData);
                }
            });
            $scope.messages = newMessageArray;
        });

        $scope.addMessage = function(msg) {

            var msgObj = {
                to_id: toId,
                from_id: fromId,
                user_image: (fromUserInfo.result.profile_videos.length == 0 || fromUserInfo.result.profile_videos == undefined || fromUserInfo.result.profile_videos == '') ? '' : fromUserInfo.result.profile_videos[0].thumb_url,
                text: msg,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            msgRef.$add(msgObj);
            $scope.messages.push(msgObj);
            $scope.campaign_text = '';
        };

        var already_contributed = $stateParams.already_contributed;
        if ($rootScope.previousState == 'contribution') {
            if (already_contributed == 'true') {
                $scope.campaign_status = 1;
            } else {
                $scope.campaign_status = 0;
            }
        }

    });