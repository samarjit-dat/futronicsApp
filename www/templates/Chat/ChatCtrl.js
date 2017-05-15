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
        },30000);

        console.log('Touch end');
    }

    if(localStorage.getItem('userInfo')){
            var loggedinUserId = userInfo.result[0].user_id;

        $scope.giveCalory = function(){

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
    
                            var dataJson = {
                                user_who_provide_calories : loggedinUserId,
                                user_who_receive_calories : $scope.muteUserId,
                                calories_amount : 20
                            };

                            GlobalChatService.giveCalory($rootScope.formatInputString(dataJson)).then(function(res){
                                var user_info = JSON.parse(localStorage.getItem("userInfo"));
                                user_info.userInfo.result.calories = res.data.result.provider_current_calorie_amount;
                                var update_userInfo=JSON.stringify(user_info);
                                localStorage.setItem("userInfo",update_userInfo);
                            });
                            return;

                    }
                }
            ]
            });

        }


        $scope.muteUser = function(){
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
                        var msg = parseInt($scope.muteUserId);
                        var mutedListArray = [];
                        if((mutedListArray.length === 0  || mutedListArray ) && (!$localstorage.getObject('muteChatUser'))){
                                mutedListArray.push(msg);
                                $localstorage.setObject('muteChatUser',mutedListArray);
                        }else{
                            mutedListArray = $localstorage.getObject('muteChatUser');
                            if(mutedListArray.indexOf(msg) === -1){
                                mutedListArray.push(msg);
                                $localstorage.setObject('muteChatUser',mutedListArray);
                            }
                        }
                    }
                }]
            });
        }

        $scope.addFriend = function(){
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
                        });
                    }
                }]
            });
        }

        $scope.reportUser = function(){
            $scope.myVar = 'hideIt';
            $ionicPopup.show({
                template: '<div style="text-align: center">Report user?</div>',
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
                        $scope.modal_report.show();
                        var reportUserId = document.getElementById('userReport');
                        reportUserId.style.height = window.innerHeight+'px';

                        GlobalChatService.getReportUsersList($rootScope.formatInputString({user_id : $rootScope.userId}))
                            .then(function(res){
                                $scope.reportUsers = res.data.result.all_user_reported;
                            });
                    }
                }]
            });

        }

        $scope.closeReportUserModal = function(){
            $scope.modal_report.hide();
        }

        $scope.setChatUser = function (id) {
            $scope.muteUserId = id;
        };

        $scope.report = function(id){
            var dataJson = {
                user_who_report : loggedinUserId,
                user_who_is_reported : $scope.muteUserId
            }
            GlobalChatService.reportUser($rootScope.formatInputString(dataJson))
                .then(function(res){
                    console.log("Report user");
                    console.log(res);
                });
        }
    }

    /**
    * Firebase adding functionlity
    */

    $scope.addMessage = function() {
        var myChatObj = {
            id : userInfo.result[0].user_id,
            user_image : (userInfo.result.profile_videos.length == 0 || userInfo.result[0].profile_videos === undefined || userInfo.result[0].profile_videos === '') ? '' : userInfo.result[0].profile_videos[0].thumb_url,
            text: $scope.campaign_text,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };

        msgRef.$add(myChatObj);
        $scope.campaign_text = '';
        $scope.$broadcast('scroll');
    };

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
});
