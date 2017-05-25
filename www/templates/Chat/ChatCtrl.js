futronics.controller('ChatCtrl', function($scope,$state,$rootScope, AccountService,$localstorage,
    $ionicModal,$sce,$ionicPopup, $timeout,$location,IMAGE,$firebaseArray,GlobalChatService,check_GlobalCommunity,
    $interval) {

    $scope.myVar = 'hideIt';
    $scope.messages = '';
    $scope.reportUsers = null;

    var newMessageArray = [];
    var muteUserIdList = $localstorage.getObject('muteChatUser');

    /* Firebase setup */
    var ref = firebase.database().ref().child("chat").child("global");
    $scope.messages = $firebaseArray(ref);
    var msgRef = $firebaseArray(ref);

    var userInfo = JSON.parse(localStorage.getItem('userInfo')).userInfo;
    var wallet = userInfo.wallet;

    var user_id = $rootScope.userId || $rootScope.user_id;

    $scope.checkMember=function(){
        $scope.$broadcast('scroll');
        check_GlobalCommunity.check_memberOrNot();
    };

    $ionicModal.fromTemplateUrl('reportUser.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal_report = modal;
    });

    $scope.setChatUser = function (id) {
        $scope.muteUserId = id;
    };

    // create a synchronized array
    // ref.once('value', function(snapshot) {
    //     snapshot.forEach(function(childSnapshot) {
    //         var childData = childSnapshot.val();
    //         if(muteUserIdList && muteUserIdList.indexOf(parseInt(childData.id)) > -1) {
    //             newMessageArray.push(childData);
    //         }
    //     });
    //     $scope.messages = newMessageArray;
    // });

    if(localStorage.getItem('getMutedTime') === null || localStorage.getItem('getMutedTime') === undefined){
        GlobalChatService.getMutedTime()
        .then(function(res){
            localStorage.setItem('getMutedTime',res.data.result.mute_time);
        });
    }else{
        $rootScope.getMutedTime = localStorage.getItem('getMutedTime');
    }
    
    $scope.itemOnLongPress = function() {
        $scope.myVar = 'showIt'
        console.log('Long press');
    }

    $scope.itemOnTouchEnd = function() {

        $timeout(function() {
            $scope.myVar = 'hideIt';
        }, 2 * 60 * 1000);

        console.log('Touch end');
    }

    if(localStorage.getItem('userInfo')){
        var loggedinUserId = userInfo.result[0].user_id;

        $scope.giveCalory = function(){
            if($scope.muteUserId == user_id){
                toastr.error("You can not add calory yourself");
            }else{
                $scope.myVar = 'hideIt';
                $ionicPopup.show({
                    template: '<div style="text-align: center">Give user calories ?</div>',
                    scope: $scope,
                    buttons: [
                    { 
                        text: 'Cancle' ,
                        type: 'button-dark',
                        onTap: function(e) {
                            return;
                        }
                    },{ 
                        text: 'Ok' ,
                        type: 'button-calm',
                        onTap: function(e) {
                            var caloryAmount = 1;
                            var dataJson = {
                                user_who_provide_calories : loggedinUserId,
                                user_who_receive_calories : $scope.muteUserId,
                                calories_amount : caloryAmount
                            };

                            GlobalChatService.giveCalory($rootScope.formatInputString(dataJson))
                                .then(function(res){
                                    var user_info = JSON.parse(localStorage.getItem("userInfo"));
                                    user_info.userInfo.result.calories = res.data.result.provider_current_calorie_amount;
                                    var update_userInfo=JSON.stringify(user_info);
                                    localStorage.setItem("userInfo",update_userInfo);
                                    toastr.success(caloryAmount+ ' calory add to ' +getUserName($scope.muteUserId));
                                });
                            return;
                        }
                    }
                ]
                });
            }
        }


        $scope.muteUser = function(){
            if($scope.muteUserId == user_id){
                toastr.error("You can not mute yourself");
            }else{
                $scope.myVar = 'hideIt';
                $ionicPopup.show({
                    template: '<div style="text-align: center">Mute user?</div>',
                    scope: $scope,
                    buttons: [
                    { 
                        text: 'Cancle' ,
                        type: 'button-dark',
                        onTap: function(e) {
                            return;
                        }
                    },{ 
                        text: 'Ok' ,
                        type: 'button-calm',
                        onTap: function(e) {
                            var msg = {
                                id : parseInt($scope.muteUserId),
                                time : Date.now()
                            };

                            var mutedListArray = [];
                            if((mutedListArray.length === 0  || mutedListArray ) && (!$localstorage.getObject('muteChatUser'))){
                                    mutedListArray.push(msg);
                                    $localstorage.setObject('muteChatUser',mutedListArray);
                                    toastr.success(getUserName($scope.muteUserId)+' muted successfully');
                            }else{
                                mutedListArray = $localstorage.getObject('muteChatUser');
                                if(mutedListArray.indexOf(msg) === -1){
                                    mutedListArray.push(msg);
                                    $localstorage.setObject('muteChatUser',mutedListArray);
                                    toastr.success(getUserName($scope.muteUserId)+' muted successfully');
                                }
                            }
                        }
                    }]
                });
            }
        }

        $scope.addFriend = function(){
            if($scope.muteUserId == user_id){
                toastr.error("You can not add as friend yourself");
            }else{
                $scope.myVar = 'hideIt';
                $ionicPopup.show({
                    template: '<div style="text-align: center">Bookmark user?</div>',
                    scope: $scope,
                    buttons: [
                    { 
                        text: 'Cancle' ,
                        type: 'button-dark',
                        onTap: function(e) {
                            return;
                        }
                    },{ 
                        text: 'Ok' ,
                        type: 'button-calm',
                        onTap: function(e) {
                            var dataJson = {
                                user_who_added_friend : loggedinUserId,
                                user_who_is_added : $scope.muteUserId
                            };
                            GlobalChatService.addFriend($rootScope.formatInputString(dataJson)).then(function(res){
                                console.log("Add Friend");
                                console.log(res);
                                toastr.success('Friend added successfully');
                            });
                        }
                    }]
                });
            }
        }

        $scope.reportUser = function(){
            if($scope.muteUserId == user_id){
                toastr.error("You can not report yourself");
            }else{
                $scope.myVar = 'hideIt';
                $ionicPopup.show({
                    template: '<div style="text-align: center">Report user?</div>',
                    scope: $scope,
                    buttons: [{ 
                        text: 'Cancle' ,
                        type: 'button-dark',
                        onTap: function(e) {
                            return;
                        }
                    },{ 
                        text: 'Ok' ,
                        type: 'button-calm',
                        onTap: function(e) {
                            $scope.modal_report.show();
                            var reportUserId = document.getElementById('userReport');
                            reportUserId.style.height = window.innerHeight+'px';
                            console.log($rootScope.userId)
                            GlobalChatService.getReportUsersList($rootScope.formatInputString({user_id : $rootScope.userId}))
                                .then(function(res){
                                    $scope.reportUsers = res.data.result.all_user_reported;
                                });
                        }
                    }]
                });
            }
        }

        $scope.closeReportUserModal = function(){
            $scope.modal_report.hide();
        }

        $scope.report = function(id){

            var dataJson = {
                user_who_report : loggedinUserId,
                user_who_is_reported : id
            }
            GlobalChatService.reportUser($rootScope.formatInputString(dataJson))
                .then(function(res){
                    console.log("Report user");
                    console.log(res);
                    $scope.modal_report.hide();
                    toastr.success('User reported successfully');
                });
        }
    }

    /**
    * Firebase adding functionlity
    */

    $scope.addMessage = function() {
        if($scope.campaign_text){
            var myChatObj = {
            id : userInfo.result[0].user_id,
                user_image : (userInfo.result.profile_videos.length == 0 || userInfo.result[0].profile_videos === undefined || userInfo.result[0].profile_videos === '') ? '' : userInfo.result[0].profile_videos[0].thumb_url,
                text: $scope.campaign_text,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            msgRef.$add(myChatObj);
            $scope.campaign_text = '';
            $scope.$broadcast('scroll');
        }
    };
    var mutedTime = $rootScope.getMutedTime;
    var removeIndex = null,removeElement=null;

    $interval(function(){
        var now = Date.now();
        var cutoff = now - (mutedTime * 60 * 1000);
        if($localstorage.getObject('muteChatUser') && $localstorage.getObject('muteChatUser').length){
            $localstorage.getObject('muteChatUser').forEach(function(ele,index){
                if(ele.time < cutoff) {
                    removeIndex = index;
                    removeElement = ele;
                    console.log(index);
                    var dataMuted = $localstorage.getObject('muteChatUser');
                    toastr.success(getUserName(removeElement.id)+' unmuted successfully');
                    dataMuted.splice(index,1);
                    $localstorage.setObject('muteChatUser',dataMuted);
                }
                console.log(ele);
            });
        }
    },1*1000);

    // $interval(function(){
    //     var now = Date.now();
    //     var cutoff = now - (15 * 60 * 1000);
    //     ref.on('value', function(snapshot) {
    //         if(snapshot.val() !== null){
    //             snapshot.forEach(function(childSnapshort){
    //                 if(childSnapshort.val().createdAt < cutoff){
    //                     snapshot.ref.remove();
    //                 } 
    //             });  
    //         }
    //     });
    // },1000);

    function getUserName(muteUserId){
        var userName = null;
        userName = $localstorage.getObject('allUserDetails').map(function(ele){
            // console.log(ele);
            if(ele.user_details.user_id == muteUserId){
                return ele.user_details.full_name;
            }
        });
        return userName.filter(function(e){return e});
    }
});
