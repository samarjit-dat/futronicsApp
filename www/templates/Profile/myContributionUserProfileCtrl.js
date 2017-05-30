futronics.controller('myContributionUserProfileCtrl', function($scope, $state,
    $rootScope, $localstorage, check_GlobalCommunity,
    $firebaseArray, AccountService, $stateParams, CaloryHaveOrGiven, MotivationPercent) {

    $scope.mycontributionUserDetails = JSON.parse($localstorage.get('myContribution_userProfile'));
    $scope.messages = [];
    var ref = firebase.database().ref().child("chat").child("private");
    var referStae = localStorage.getItem("refrstate");
    alert(referStae)
    $scope.myContribution = function() {
        $state.go('myContribution');
    };

    $scope.checkMember = function() {
        check_GlobalCommunity.check_memberOrNot();
    };

    console.log($scope.mycontributionUserDetails)
    MotivationPercent.getPercent($rootScope.formatInputString({ user_id: $scope.mycontributionUserDetails.user_id, campaign_id: $scope.mycontributionUserDetails.contribute_campaign[0].campaign_id }))
        .then(function(res) {
            $scope.motivation_percentage = res.data.result.percentile_amount_collected;
        });

    $scope.userdata = AccountService.getUserInfo();
    /**
     * Firebase adding functionlity
     */

    var msgRef = $firebaseArray(ref);
    $scope.messages = $firebaseArray(ref);

    var fromUserInfo = $scope.userdata.userInfo;
    var toUserInfo = $scope.mycontributionUserDetails;

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
    console.log(fromId, toId);

    ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.to_id == toId) {
                newMessageArray.push(childData);
            }
        });
        console.log(newMessageArray);
        $scope.messages = newMessageArray;
    });

    //    msgRef.$watch(function() {
    //        console.log("data changed!");
    //    });

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