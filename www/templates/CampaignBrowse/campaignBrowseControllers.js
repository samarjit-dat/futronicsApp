futronics.controller('campaignBrowseControllers',
    function($scope,Loader,UserListService,AllUser_MyContribution,StorageService,
        $localstorage,$state,$rootScope, AccountService,$ionicPopup,
        $timeout,ionPullUpFooterState,stateFactory,LogoutService,IMAGE,$http,
        $stateParams,ContributionServices) {

    stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()

    if($rootScope.isMaintain === undefined){
        $rootScope.isMaintain = null;
    }
    var contributedIdList = [];

    ContributionServices.whomeIContributed($rootScope.formatInputString({user_id : $rootScope.userId}))
        .then(function(res){
            angular.forEach(res.data.result.all_contributors, function(value, key){
                contributedIdList.push(value);
            });
        })
        .catch(function(err){
            console.log(err);
        });

    if($localstorage.get('Welcome')){
        $ionicPopup.show({
            template: 'Support others to become part of the community”. Please restate this to “You’re on your way to a new life! We have credited your account with $'+$stateParams.motivationAmount+' for the use of supporting others. Please take this time, prior to your campaign setup, to support your fellow Diet Money user. You can complete your campaign setup thereafter',
            title: '<p style="color:black"><b>Welcome</b></p>',
            scope: $scope,
            buttons: [{ 
                text: 'Ok' ,
                type: 'button-calm'
            }]
        });
        $localstorage.remove('Welcome');
    }

    $scope.noData=false;
    $scope.onFooterExpand = function() {
           //console.log('Footer expanded');
         };
         $scope.onFooterCollapse = function() {
            // console.log('Footer collapsed');
         };

         $scope.expand = function() {
           $scope.footerState = ionPullUpFooterState.EXPANDED;
    };
    $scope.check=0;
      $scope.userdata='';

       $scope.userdata=AccountService.getUserInfo();
       //console.log($scope.userdata);
       if($scope.userdata==undefined){
          $scope.check=0;
       }else{
          $scope.check=$scope.userdata.userInfo.status;
       }

       $scope.myOwnProfile=function(){
          if($rootScope.user_id == null || $rootScope.user_id == '' || $rootScope.user_id == undefined ){
               $state.go('profile');
          }else {
                localStorage.removeItem('viewIndividualProfile_globalChat');
                localStorage.setItem('myProfile','1');
                $state.go('profile');
          }
      };
       /* ***** Logout **** */
      $scope.logout=function(){
        LogoutService.logout();
      };
      StorageService.storage();
      $scope.noMoreItemsAvailable=false;
      $scope.pageValue=1;
      /* **************** Fetch USERINFO FROM LOCALSTORAGE*********************************** */
     $scope.usrId=function(data){

       return $rootScope.user_id !==data.user_details.user_id;
     };
    $rootScope.allUser=[];
    var allCorrectDetails = [];
    var countNosOfStatusOne = 0;
    //if($rootScope.previousState==='signup' || $rootScope.previousState===''){
        $scope.pageValue=1;
        $scope.userListShowbeforeLogin=[];
        var data={
                page:$scope.pageValue
        };
    var data=$rootScope.formatInputString(data);
    Loader.showLoading();
    
    UserListService.userListOnLoad(data)
                       .then(function(res){

                           //console.log('res');
                           //console.log(res.data.count);
                           console.log(res);
        if(res.data.status !== 2){
           $localstorage.set('allUserDetails',JSON.stringify(res.data.result));
            if(res.data.result.length!==0){
                for(var i=0;i<res.data.result.length;i++){
                 //console.log(res.data.result[i]);
                  if(res.data.result[i].campaign.length > 0){
                        if(res.data.result[i].campaign[0].campaign_status==1){
                           
                            if($rootScope.user_id != res.data.result[i].user_details.user_id) {
                                $rootScope.allUser.push(res.data.result[i]);
                            }

                            $scope.callLoadMore();
                            
                        }
                    }
                }
            } 
        }else{
            
      if(localStorage.getItem('allUserDetails')){
           AllUser_MyContribution.storage();

      $scope.userListShowbeforeLogin=[];

      var initialPageNo=Math.ceil($rootScope.all_user_details.length/20);
      $scope.pageValue=initialPageNo;
       $scope.loadMoreX = function() {
        if($scope.pageValue==0){
         $scope.pageValue++;
        }else{
         $scope.pageValue++;
        }
        var data={
                 page:$scope.pageValue
        };
        var data=$rootScope.formatInputString(data);
        UserListService.userListOnLoad(data).then(function(res){

            if(res.data.message==="No result found"){
//                $scope.noData=true;
                //Loader.hideLoading();
                $timeout(function(){
                     $scope.noData=false;
                }, 2500);
                $scope.noMoreItemsAvailable=true;
                $scope.pageValue =0;

            }else{
                for(var i=0;i<res.data.result.length;i++){
                  //$rootScope.allUser.push(res.data.result[i]);
                  
                        //console.log(res.data.result[i]);
                        if(res.data.result[i].campaign.length>0){
                            if(res.data.result[i].campaign[0].campaign_status==1){
                                // $rootScope.allUser.push(res.data.result[i]);
                                if($rootScope.user_id != res.data.result[i].user_details.user_id) {
                                    for(var j=0;j<$rootScope.allUser.length;j++){
                                        allCorrectDetails.push($rootScope.allUser[j].user_details.user_id)
                                    }

                                    if(allCorrectDetails.indexOf(res.data.result[i].user_details.user_id) == -1)
                                        $rootScope.allUser.push(res.data.result[i]);
                                }
                            }
                        }
                    
                }
                $localstorage.set('allUserDetails',JSON.stringify($rootScope.allUser));
               // Loader.hideLoading();
               console.log($rootScope.allUser)
        };
         $scope.$broadcast('scroll.infiniteScrollComplete');
        });

        };
        }
        }
               Loader.hideLoading();
        });
//     }else{
//       if(localStorage.getItem('allUserDetails')){
//            AllUser_MyContribution.storage();

//       $scope.userListShowbeforeLogin=[];

//       var initialPageNo=Math.ceil($rootScope.all_user_details.length/20);
//       $scope.pageValue=initialPageNo;
//        $scope.loadMoreX = function() {
//         if($scope.pageValue==0){
//          $scope.pageValue++;
//         }else{
//          $scope.pageValue++;
//         }
//         var data={
//                  page:$scope.pageValue
//         };
//         var data=$rootScope.formatInputString(data);
//         UserListService.userListOnLoad(data).then(function(res){

//             if(res.data.message==="No result found"){
// //                $scope.noData=true;
//                 //Loader.hideLoading();
//                 $timeout(function(){
//                      $scope.noData=false;
//                 }, 2500);
//                 $scope.noMoreItemsAvailable=true;
//                 $scope.pageValue =0;

//             }else{
//                 for(var i=0;i<res.data.result.length;i++){
//                   //$rootScope.allUser.push(res.data.result[i]);
                  
//                         //console.log(res.data.result[i]);
//                         if(res.data.result[i].campaign.length>0){
//                             if(res.data.result[i].campaign[0].campaign_status==1){
//                                 // $rootScope.allUser.push(res.data.result[i]);
//                                 if($rootScope.user_id != res.data.result[i].user_details.user_id) {
//                                     for(var j=0;j<$rootScope.allUser.length;j++){
//                                         allCorrectDetails.push($rootScope.allUser[j].user_details.user_id)
//                                     }

//                                     if(allCorrectDetails.indexOf(res.data.result[i].user_details.user_id) == -1)
//                                         $rootScope.allUser.push(res.data.result[i]);
//                                 }
//                             }
//                         }
                    
//                 }
//                 $localstorage.set('allUserDetails',JSON.stringify($rootScope.allUser));
//                // Loader.hideLoading();
//                console.log($rootScope.allUser)
//         };
//          $scope.$broadcast('scroll.infiniteScrollComplete');
//         });

//         };
//         }
//     }

      $scope.goToContribution=function(single_user){
          if(contributedIdList != undefined) {
            if(localStorage.getItem('endcampaign')){
                    localStorage.setItem('campaignCompleteOrNot',$rootScope.userId);
                    localStorage.removeItem('showGlobalChat_afterEndCampaign');
            }
            var userName = single_user.user_details.full_name;
            var userId = single_user.user_details.user_id;

            localStorage.setItem('single_user',JSON.stringify(single_user));
                if(!$rootScope.userId){

                $ionicPopup.show({
                        template: 'Please Login to participate in campaign',
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                        scope: $scope,
                        buttons: [
                        { text: 'Ok' ,
                        type: 'button-calm',
                            onTap: function(e) {
                            $state.go("login");
                                return;

                        }
                        }
                    ]
                });
            }else{
                if(contributedIdList.length === 0){
                    $ionicPopup.show({
                        template: 'You’re about to contribute to ' + userName,
                        title: '<p style="color:black"><b>Attention!!!</b></p>',
                        scope: $scope,
                        buttons: [{ 
                            text: 'Back' ,
                            type: 'button-dark',
                            onTap: function(e) {
                                return;
                            }
                        },{ 
                            text: 'Yes' ,
                            type: 'button-calm',
                            onTap: function(e) {
                                $state.go('contribution',{id:single_user.user_details.user_id});
                                return;
                            }
                        }]
                    });
                }else{
                    if(contributedIdList.indexOf(userId) > -1){
                        $ionicPopup.show({
                            template: 'You’ve supported '+userName+' already, would you like to support him more funds?',
                            title: '<p style="color:black"><b>Attention!!!</b></p>',
                            scope: $scope,
                            buttons: [{ 
                                text: 'Back' ,
                                type: 'button-dark',
                                onTap: function(e) {
                                    return;
                                }
                            },{ 
                                text: 'Yes' ,
                                type: 'button-calm',
                                onTap: function(e) {
                                    $state.go('contribution',{id:single_user.user_details.user_id});
                                    // repeateContribuationPopup(userName);
                                    return;
                                }
                            }]
                        }); 
                    }else{
                        repeateContribuationPopup(userName);
                    }
                }
                // $state.go('contribution',{id:single_user.user_details.user_id});
            }
            } else {
                localStorage.setItem('single_user',JSON.stringify(single_user));
                $state.go('contribution',{id:single_user.user_details.user_id});
            }
      }

      function repeateContribuationPopup(userName,userId){
        $ionicPopup.show({
            template: 'You’re about to contribute to ' + userName,
            title: '<p style="color:black"><b>Attention!!!</b></p>',
            scope: $scope,
            buttons: [{ 
                text: 'Back' ,
                type: 'button-dark',
                onTap: function(e) {
                    return;
                }
            },{ 
                text: 'Yes' ,
                type: 'button-calm',
                onTap: function(e) {
                    $state.go('contribution',{id:userId});
                    return;
                }
            }]
        });
      }
       /* *****  user own profle start **** */
     if(localStorage.getItem('myProfile')!=null){
         $scope.totalCampaign='';
         $scope.myProfile=0;
         $scope.my_details='';
         $scope.my_details=JSON.parse(localStorage.getItem('userInfo'));
         console.log('my_details');
         console.log($scope.my_details.userInfo.result.campaign);
         if($scope.my_details.userInfo.result.campaign==[]){
             //alert('hi');
             $scope.totalCampaign=0;
         }

         $scope.myProfile='';
     }else{
          $scope.totalCampaign=0;
     }
     $scope.callLoadMore = function() {
         console.log('xxxx');
     if(++countNosOfStatusOne <= 20){
         
                                 var initialPageNo=1;
                                $scope.pageValue=initialPageNo;
                                //$scope.loadMoreX = function() {
                                     console.log('xxx111x');
                                    if($scope.pageValue==0){
                                    $scope.pageValue++;
                                    }else{
                                    $scope.pageValue++;
                                    }
                                    var data={
                                            page:$scope.pageValue
                                    };
                                    var data=$rootScope.formatInputString(data);
                                    UserListService.userListOnLoad(data).then(function(res){

                                        if(res.data.message==="No result found"){
                            //                $scope.noData=true;
                                            //Loader.hideLoading();
                                            $timeout(function(){
                                                $scope.noData=false;
                                            }, 2500);
                                            $scope.noMoreItemsAvailable=true;
                                            $scope.pageValue =0;

                                        }else{
                                            for(var i=0;i<res.data.result.length;i++){
                                                    if(res.data.result[i].campaign.length>0 ){
                                                        if(res.data.result[i].campaign[0].campaign_status==1){
                                                            if($rootScope.user_id != res.data.result[i].user_details.user_id) {
                                                                for(var j=0;j<$rootScope.allUser.length;j++){
                                                                    allCorrectDetails.push($rootScope.allUser[j].user_details.user_id)
                                                                }

                                                                if(allCorrectDetails.indexOf(res.data.result[i].user_details.user_id) == -1)
                                                                    $rootScope.allUser.push(res.data.result[i]);
                                                            }
                                                        }
                                                    }
                                                
                                            }
                                            $localstorage.set('allUserDetails',JSON.stringify($rootScope.allUser));
                                        // Loader.hideLoading();
                                        console.log($rootScope.allUser)
                                    };
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                    });

                                  //  };
                            }
        }
    /* *****  user own profle end**** */

});
