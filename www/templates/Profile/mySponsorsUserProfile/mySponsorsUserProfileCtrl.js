futronics.controller('mySponsorsUserProfileCtrl', function($scope, $state,
    $rootScope, $localstorage, check_GlobalCommunity, MotivationPercent,
    $firebaseArray, AccountService, $stateParams, CaloryHaveOrGiven) {

    if (localStorage.getItem('userInfo')) {
        var user = JSON.parse(localStorage.getItem('userInfo'));
        if (user.userInfo.result.campaign.length > 0) {
            var campaign_status = user.userInfo.result.campaign[0].campaign_status;
        }
    }
    $scope.mySponsors_userProfile = JSON.parse($localstorage.get('mySponsors_userProfile'));

    MotivationPercent.getPercent($rootScope.formatInputString({ user_id: $scope.mySponsors_userProfile.user_id, campaign_id: $scope.mySponsors_userProfile.running_campain_id }))
        .then(function(res) {
            $scope.motivation_percentage = Math.round(res.data.result.percentile_amount_collected).toFixed();
        });
    $scope.messages = [];
    var ref = firebase.database().ref().child("chat").child("private");

    $scope.mySponsored = function() {
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
    var toUserInfo = $scope.mySponsors_userProfile;

    var fromId = fromUserInfo.result[0].user_id;
    var toId = toUserInfo.user_id;

    $scope.addMessage = function(msg) {

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
    };

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

    /* *** Show calory how much user have and given ******** */
    var allId = $stateParams.id;

    if (allId != null && allId != '' && allId != undefined) {
        localStorage.setItem('allIds_ShowCaloryDetailsMyContributeUser', allId);
    }
    if (localStorage.getItem('allIds_ShowCaloryDetailsMyContributeUser')) {
        var allId = localStorage.getItem('allIds_ShowCaloryDetailsMyContributeUser');
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
});