futronics.controller('ProfileViewStatsCtrl',
    function($scope,$rootScope,AccountService,UserListService,check_GlobalCommunity, 
    $ionicHistory,StorageService,$ionicModal,$sce,$http,$state,
    $window,$localstorage,$ionicPopup,URL,$location,IMAGE,
    CaloryService,ViewMyStats,CaloryHaveOrGiven) {
    
    StorageService.storage();
    $scope.ViewMyStatsData = {};

    var __data = {
      user_id: $rootScope.user_id
    };

    ViewMyStats.getDetails($rootScope.formatInputString(__data))
    .then(function(res){
      var _data = res.data.result;
      console.log(_data.campaign_contributed_to_count);
      $scope.ViewMyStatsData.campaign_contributed_to_count = _data.campaign_contributed_to_count;
      $scope.ViewMyStatsData.cash_now_in_wallet = _data.cash_now_in_wallet;
      $scope.ViewMyStatsData.total_calories_received = _data.total_calories_received;
      $scope.ViewMyStatsData.total_calories_to = _data.total_calories_to;

      $scope.ViewMyStatsData.total_fund_contributed = _data.total_fund_contributed;
      $scope.ViewMyStatsData.total_money_made_from_contributed_campaign = _data.total_money_made_from_contributed_campaign;
      $scope.ViewMyStatsData.total_potential_money_to_be_made  = _data.total_potential_money_to_be_made ;
      $scope.ViewMyStatsData.total_sponsored_aquired = _data.total_sponsored_aquired;
      $scope.ViewMyStatsData.total_value_of_my_diet_money_account = _data.total_value_of_my_diet_money_account;
      console.log(_data);
    })
    .catch(function(err){
      console.log(err);
    });

    /* ************************* Show User List Start************************************************ */
    $ionicModal.fromTemplateUrl('videoModalScript.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal_video = modal;
    });
        
      $scope.user_list=function(){
        $state.go('campaignBrowse');
    }
      
   
      

     /* *************** Show User List End********************************************************** */
    /*** checking for Login or Logout state start****/

      $scope.check=0;
      $scope.userdata='';

       $scope.userdata=AccountService.getUserInfo();
       console.log($scope.userdata);
       if($scope.userdata==undefined){
          $scope.check=0;
       }else{
          $scope.check=$scope.userdata.userInfo.status;
       }
    /*** checking for Login or Logout state end****/
      //$scope.items=friends;
      $scope.user_id='';
      $scope.logout=function(){
          console.log('logout');
            userInfo = null;
            $localstorage.remove('userInfo');
            if(userInfo=="" || userInfo==null){

               $ionicPopup.show({
                    template: 'You successfully logged out',
                    title: '<p style="color:black"><b>Logout</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm',
                      onTap: function(e) {
                          $ionicHistory.clearCache();
                          $state.go("login");
                              return;

                      }
                    }

                    ]
        });

      }

     }
      $scope.slideHasChanged = function(index) {

          //$scope.items.push("{name:'John', age:25, gender:'boy'}");
      }

    /* **************** Fetch USERINFO FROM LOCALSTORAGE End*********************************** */
   $scope.checkMember=function(){
            check_GlobalCommunity.check_memberOrNot();
    }
    /* *** username and details start *** */
    $scope.myProfile=0;
    $scope.otherProfile='';


    var imgObj = [];

    $scope.mainImage =  IMAGE.BASE_IMAGE;
    
    /* *****  user own profle start **** */
         $scope.my_details='';
         $scope.my_details=JSON.parse(localStorage.getItem('userInfo'));
         
          $scope.my_details.userInfo.result.profile_images.forEach(function(ele){
            var requiredParams = [];
            var imageStr = ele.profile_image;
            requiredParams['profile_image'] = imageStr;
            imgObj.push(requiredParams);
          });
          $scope.my_details.userInfo.result.profile_videos.forEach(function(ele){
            var requiredParams = [];
            var videoThumbUrlbStr = ele.thumb_url;
            var videoUrlStr = ele.video_url;
            requiredParams['thumb_url'] = videoThumbUrlbStr;
            requiredParams['video_url'] = videoUrlStr;
            imgObj.push(requiredParams);
          });
          
        if(imgObj.length>0){ 
            
            var appBasePath = $location.absUrl();
            appBasePath = appBasePath.substring(0,appBasePath.indexOf('#'));
            $scope.mainImage = appBasePath+'img/circle.png';
            
            $scope.profileImages = array_chunk(imgObj,3);

            function array_chunk(array,chunkSize){
              return [].concat.apply([],
                array.map(function(elem,i) {
                  return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
                })
              );
            }
       
            if(imgObj[0]['profile_image']){
                $scope.mainImage = imgObj[0]['profile_image'];
            }else if(imgObj[0]['thumb_url']){
               $scope.mainImage = imgObj[0]['thumb_url']; 
            }
        }else{
            $scope.mainImage =  IMAGE.BASE_IMAGE;
        }
         if($scope.my_details.userInfo.result.campaign==[]){
            $scope.totalCampaign=0;
         }
  
     
    /************************** video open on modal **************************************/
    $scope.openMainImageVideoModal = function(){
        var profileImagesDomEle = angular.element(document.querySelector('#profileMainImage'));
        $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(profileImagesDomEle[0].alt);
        
        if(profileImagesDomEle[0].alt!=='' && profileImagesDomEle[0].alt!=='undefined'){
           
            console.log('*************************************');
            console.log(typeof(profileImagesDomEle[0].alt));
            $scope.modal_video.show();
        }else{
             $scope.modal_video.hide();
        }
    };
    
    
    $scope.openVideoModal = function(video_url){
       $scope.modal_video.videoUrl = $sce.trustAsResourceUrl(video_url);
       $scope.modal_video.show();
    };

    $scope.closeModal = function(){
      $scope.modal_video.hide();
    };
    console.log(JSON.parse(localStorage.getItem("userInfo")));
    $scope.purchaseCalory=function(){
       $scope.modal_purchaseCalory.show();
       CaloryService.getCaloryList().then(function(res){
            var _res = res.data;
            if(_res.status === 1){
                $scope.modal_purchaseCalory.caloryData = _res.result;
            }
        });
    };
    $scope.closePurchaseCaloryModal=function(){
        $scope.modal_purchaseCalory.hide(); 
    };  
     $scope.caloryPurchase=function(CaloryData){
        console.log(CaloryData);
         $ionicPopup.show({
                    template: 'This is a confirmation that you are buying ' + CaloryData.calories + ' calories for $' + CaloryData.cost,                  
                    scope: $scope,
                    cssClass:"custom-popup-confirm ",
                    buttons: [
                    { text: 'No',
                    onTap: function(e) {
                          $ionicHistory.clearCache();
                          $scope.Cancel(); 
                              return;

                      }
                    },    
                    { text: 'Yes' ,
                    type: '',
                      onTap: function(e) {
                        $ionicHistory.clearCache();
                        $scope.Ok(); 
                        
                        var dataJson = {
                            money_paid : CaloryData.cost,
                            user_who_purchase : $scope.my_details.userInfo.result[0].user_id
                         };
                         CaloryService.purchaseCalory($rootScope.formatInputString(dataJson)).then(function(res){
                            
                              console.log("Purchase calory");
                              var user_info = JSON.parse(localStorage.getItem("userInfo"));
                              console.log(user_info);
                              user_info.userInfo.result.user_info[0].calorie = res.data.result.current_calorie_amount;
                              
                              user_info.userInfo.result.user_info[0].wallet = res.data.result.wallet_money;
                              user_info.userInfo.result.wallet = res.data.result.wallet_money;
                              
                              $localstorage.setObject("userInfo",user_info);
                              console.log(user_info);
                             return;
                         });

                      }
                    }

                    ]
        });
        $scope.Ok=function(){
           $ionicPopup.show({
                    template:  CaloryData.calories + ' calories have been added to your calorie total!Go get the encourgement you need by steering your visitors in the right direction, and rewarding them for good advice!',                  
                    scope: $scope,
                    cssClass:"custom-popup",
                    buttons: [
                    { text: 'Exit',
                    onTap: function(e) {
                          $ionicHistory.clearCache();
                          $scope.modal_purchaseCalory.hide(); 
                          $state.go('profile'); 
                              return;

                      }
                    }    
                   ]
        });
        };
        $scope.Cancel=function(){
            $ionicPopup.show({
                    template: CaloryData.calories + ' calories have not been added to your Diet Money calorie total and you have not been charged $' + CaloryData.cost,                  
                    scope: $scope,
                    cssClass:"custom-popup",
                    buttons: [
                    { text: 'Exit',
                    onTap: function(e) {
                          $ionicHistory.clearCache();
                          $scope.modal_purchaseCalory.hide(); 
                          $state.go('profile'); 
                              return;

                      }
                    }    
                   ]
        });
        };
   
    };
    /***************************** video open on modal ************************************/
     /* *****  user own profle end**** */


     /* ***** check user login or not start***** */
     if(localStorage.getItem('userInfo')===null){
            $scope.check=0;
            return false;

      }
    /* ***** check user login or not end***** */
    
    
    
    /****** myContribution Method Start************/
    
    $scope.myContribution=function(){
       $state.go('myContribution');
    };
    
    /****** myContribution Method End************/
     $ionicModal.fromTemplateUrl('purchaseCalory.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal_purchaseCalory = modal;
      });

     
    $scope.withdrawCash = function(){
        $state.go('withdrawCaloryAndCash',{ showCashAndCalory : 1});
    }

    $scope.withdrawCalory = function(){
        $state.go('withdrawCaloryAndCash',{ showCashAndCalory : 2});
    }
    
    /* *** Show calory how much user have and given ******** */
    var myId =  $rootScope.user_id;
    if(myId != null && myId != '' && myId != undefined) {
           localStorage.setItem('myId_ShowCaloryDetails',myId);
    }
    if(localStorage.getItem('myId_ShowCaloryDetails')) {
        var allId = localStorage.getItem('myId_ShowCaloryDetails');
        var data ={
               user_id:myId 
        };
        var data=$rootScope.formatInputString(data);
        CaloryHaveOrGiven.calories(data).then(function(response){
            $scope.total_calorie_given = response.data.result.total_calorie_given;
            $scope.total_calorie_have = response.data.result.total_calorie_have;
        });
    }
    /* *** Show calory how much user have and given ******** */
    
});


