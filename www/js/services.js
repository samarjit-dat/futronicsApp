futronics.service("ContributionServices", function($http,$q, $localstorage,URL,Loader,$rootScope) {
  this.contribute = function(data){
       Loader.showLoading();
       var contributeApi;
       if($rootScope.isMaintain == 'false'){
             contributeApi = "/contributionApi";
        }else {
             contributeApi = "/maintencePhaseContribution";
        }
      var defered=$q.defer();
    return $http({
            method: "POST",
            url: URL.BASE+contributeApi,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            console.log(response+"contribution");
            Loader.hideLoading();
            if($rootScope.isMaintain == 'false'){
                var userInfo = {
                    accessToken: response.data.access_token,
                    userInfo: response.data
                };
                $localstorage.setObject("userInfo",userInfo);
            }
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
    };

    this.whomeIContributed = function(data){
        var defered=$q.defer();
        return $http({
                method: "POST",
                url: URL.BASE+'/userAllContributionList',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data:data
            }).then(function(response){
                defered.resolve(response);
                return defered.promise;
            },function(error){
                defered.reject(error);
            });
    };
});
futronics.service('AddFundServices',function($http,$q,URL,Loader,$localstorage){
    this.addFund = function(data){
      Loader.showLoading();
      var defered=$q.defer();
      return $http({
            method: "POST",
            url: URL.BASE+"/addingFundToUserWallet",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            console.log(response+"fund");
            Loader.hideLoading();
            var user_info=JSON.parse(localStorage.getItem("userInfo"));
            user_info.userInfo.result.wallet=response.data.result.wallet;
            var update_userInfo=JSON.stringify(user_info);
//            var userInfo = {
//                userInfo: update_userInfo
//            };
            localStorage.setItem("userInfo",update_userInfo);
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

    };
});

futronics.service('ContactAdminCatagory',function($http,$q,URL,Loader,$localstorage){
    this.catagory=function(){
        Loader.showLoading();
        var defered=$q.defer();
        return $http({
            method: "POST",
            url: URL.BASE+"/adminContactCategory",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},

        }).then(function(response){
            //console.log(response);
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
    };
});

 futronics.service('ContactAdminSend',function($http,$q,URL,Loader,$localstorage){
     this.sendmail=function(data){
         Loader.showLoading();
        var defered=$q.defer();
        return $http({
            method: "POST",
            url: URL.BASE+"/contactWithAdminMail",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            //console.log(response);
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
     };
 });


 futronics.service('MaintainService',function($http,$q,URL,Loader,$localstorage){
     this.maintainPhase=function(data){
         Loader.showLoading();
        var defered=$q.defer();
        return $http({
            method: "POST",
            url: URL.BASE+"/campaignInMaintenancePhase",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            //console.log(response);
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
     };
 });

futronics.service('FakeVideoService',function($http,$q,URL,Loader,$localstorage,$rootScope){
     this.fakeVideo=function(data){
        Loader.showLoading();
        var defered=$q.defer();
        var fakeVideoUrl;
        if($rootScope.isMaintain == 'false'){
             fakeVideoUrl = "/reportFakeRequest";
        }else {
             fakeVideoUrl = "/maintencePhaseFakeReportRequest";
        }
        return $http({
            method: "POST",
            url: URL.BASE+fakeVideoUrl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            //console.log(response);
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
     };
 });

 futronics.service('GoodVideoService',function($http,$q,URL,Loader,$localstorage){
     this.goodVideo=function(data){
        Loader.showLoading();
        var defered=$q.defer();
        return $http({
            method: "POST",
            url: URL.BASE+"/videoMarkedAsGood",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            //console.log(response);
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
     };
 });


 futronics.service('FakevideoReportList',function($http,$q,URL,Loader,$localstorage){
     this.list=function(){
        Loader.showLoading();
        var defered=$q.defer();
        return $http({
            method: "GET",
            url: URL.BASE+"/fakeVideoReportOptions",
            headers: {'Content-Type': 'application/json'},
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            defered.reject(error);
        });
     };
 });

 futronics.service('GlobalChatService',function($http,$q,URL,Loader,$rootScope){
     this.addFriend = function(_data){
        Loader.showLoading();
        var defered=$q.defer();

        $http({
            method: "POST",
            url: URL.BASE+"/addFriendRequest",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:_data
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

        return defered.promise;
     };

     this.giveCalory=function(_data){
        Loader.showLoading();
        var defered=$q.defer();

        $http({
            method: "POST",
            url: URL.BASE+"/provideCaloriesToUser",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: _data
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

        return defered.promise;
     };

     this.reportUser = function(_data){
        Loader.showLoading();
        var defered=$q.defer();

        $http({
            method: "POST",
            url: URL.BASE+"/reportUsers",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: _data
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

        return defered.promise;
     };

     this.getReportUsersList = function(_data){
        Loader.showLoading();
        var defered=$q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/allReportedUsersList",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: _data
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

        return defered.promise;
     };

     this.getMutedTime = function(_data){
        Loader.showLoading();
        var defered=$q.defer();
        $http({
            method: "GET",
            url: URL.BASE+"/userMuteApi",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: _data
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

        return defered.promise;
     };
 });


 futronics.service('CaloryService',function($http,$q,URL,Loader){
     this.getCaloryList = function(){
        Loader.showLoading();
        var defered=$q.defer();

        $http({
            method: "GET",
            url: URL.BASE+"/caloriesListing",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

        return defered.promise;
     };

     this.purchaseCalory = function(_data){
        Loader.showLoading();
        var defered=$q.defer();

        $http({
            method: "POST",
            url: URL.BASE+"/purchaseCalorie",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: _data
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });

        return defered.promise;
     }

     this.withdrawCalories = function(_data){
             Loader.showLoading();
             var defered=$q.defer();

             $http({
                 method: "POST",
                 url: URL.BASE+"/withdrawCalories",
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                 data: _data
             }).then(function(response){
                 Loader.hideLoading();
                 defered.resolve(response);
             },function(error){
                 Loader.hideLoading();
                 console.log(error+"error");
                 defered.reject(error);
             });

             return defered.promise;
          }

          this.withdrawCash = function(_data){
             Loader.showLoading();
             var defered=$q.defer();

             $http({
                 method: "POST",
                 url: URL.BASE+"/withdrawCash",
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                 data: _data
             }).then(function(response){
                 Loader.hideLoading();
                 defered.resolve(response);
             },function(error){
                 Loader.hideLoading();
                 console.log(error+"error");
                 defered.reject(error);
             });

             return defered.promise;
          }

 });

 futronics.service('SponsorsAcquired',function($http,$q,URL,Loader,$localstorage){
     this.contributionToMe=function(data){
        Loader.showLoading();
        var defered=$q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/listOfUsersContributedToAccount",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            //console.log(response);
            Loader.hideLoading();
            defered.resolve(response);

        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
         return defered.promise;
     };
 });

futronics.service('WeightLoseSuccessOrFail',function($http,$q,URL,Loader,$localstorage){
    this.SuccessOrFail = function(data){
      Loader.showLoading();
      var defered=$q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/weightLossPhaseSuccessFail",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            console.log(response+"fund");
            Loader.hideLoading();
           
            defered.resolve(response);
           
        },function(error){
            Loader.hideLoading();
            console.log(error);
            defered.reject(error);
        });
        return defered.promise; 
    };
});


futronics.service('ViewMyStats',function($http,$q,URL,Loader,$localstorage){
    this.getDetails = function(data){
      Loader.showLoading();
      var defered=$q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/myUserCampaignAllDetails",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            Loader.hideLoading();
            defered.resolve(response);
        },function(error){
            Loader.hideLoading();
            defered.reject(error);
        });
        return defered.promise; 
    };
});

futronics.directive('toggleColor',function(){
    return{
        restrict: 'EA',
        link :function(scope, elem, attrs) {
            elem.on('click',function(){
                scope.classadd = 1;
                var id = attrs.id;
                if (attrs.id == 'Aweful') {
                     scope.good = false;
                     scope.bad = false;
                     scope.great = false;
                } else if(attrs.id == 'Bad') {
                    scope.good = false;
                    scope.aweful = false;
                    scope.great = false;
                }
                 else if(attrs.id == 'Good') {
                    scope.bad = false;
                    scope.aweful = false;
                    scope.great = false;
                }
                 else {
                    scope.bad = false;
                    scope.aweful = false;
                    scope.good = false;
                }
                localStorage.setItem('aboutDay',id);
            })
           
        }
    };
});

futronics.service('HideCampaign',function($http,$q, $localstorage,URL,$rootScope){
    this.userHideCampaign = function(data){
//        console.log('HideCampaign');
//        console.log(data);
        var hideCampaignUrl;
        if($rootScope.isMaintain == 'false'){
             hideCampaignUrl = "/hidetheCampain";
        }else {
             hideCampaignUrl = "/hidetheCampainMaintence";
        }
        var defered=$q.defer();
        $http({
            method: "POST",
            url: URL.BASE+hideCampaignUrl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){ 
            console.log('response');
            console.log(response);
            var user_info=JSON.parse(localStorage.getItem("userInfo"));
            console.clear();
            console.log(user_info);
            
            //user_info.userInfo.result.campaign[0].campaign_status=response.data.status;
            user_info.userInfo.result.campaign[0].campaign_status="2";
           
            var update_userInfo=JSON.stringify(user_info);
            console.log('update_userInfo');
            console.log(update_userInfo);
            localStorage.setItem("userInfo",update_userInfo);
            
            var all_user_details=JSON.parse(localStorage.getItem("allUserDetails"));
            for(var i=0;i<all_user_details.length;i++){
            if(all_user_details[i].campaign.length>0){
                if(all_user_details[i].campaign[0].user_id==user_info.userInfo.result[0].user_id){
                    all_user_details[i].campaign[0].campaign_status="2";
                    var updated_allUserDetails=JSON.stringify(all_user_details);
                    localStorage.setItem("allUserDetails",updated_allUserDetails);
                }
              }
           }
            defered.resolve(response);
            
        },function(error){
            defered.reject(error);
        });
        return defered.promise; 
    };
});

futronics.service('ShowCampaign',function($http,$q, $localstorage,URL,$rootScope){
    this.userShowCampaign = function(data){
       // console.log('ShowCampaign');
//        console.log(data);
        var showCampaignUrl;
        if($rootScope.isMaintain == 'false'){
             showCampaignUrl = "/showtheCampain";
        }else {
             showCampaignUrl = "/showtheCampainMaintence";
        }
        var defered=$q.defer();
        
        $http({
            method: "POST",
            url: URL.BASE+showCampaignUrl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){ 
            console.log('response');
            console.log(response);
            var user_info=JSON.parse(localStorage.getItem("userInfo"));
            user_info.userInfo.result.campaign[0].campaign_status="1";
            var update_userInfo=JSON.stringify(user_info);
            localStorage.setItem("userInfo",update_userInfo);
            
            var all_user_details=JSON.parse(localStorage.getItem("allUserDetails"));
            for(var i=0;i<all_user_details.length;i++){
            if(all_user_details[i].campaign.length>0){
                if(all_user_details[i].campaign[0].user_id==user_info.userInfo.result[0].user_id){
                    all_user_details[i].campaign[0].campaign_status="1";
                    var updated_allUserDetails=JSON.stringify(all_user_details);
                    localStorage.setItem("allUserDetails",updated_allUserDetails);
                }
              }
           }
            defered.resolve(response);
            
        },function(error){
            defered.reject(error);
        });
        return defered.promise; 
    };
});

futronics.service('CaloryHaveOrGiven',function($http,$q,URL,Loader,$localstorage){
     this.calories=function(data){
        Loader.showLoading();
        var defered=$q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/calorieUserLeftandUsed",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            console.log(response);
            Loader.hideLoading();
            defered.resolve(response);
            
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
         return defered.promise;
     };
 });
 

futronics.service('FakeOrGood',function($http,$q,URL,Loader,$localstorage){
     this.getArrayList=function(data){
        Loader.showLoading();
        var defered=$q.defer();
        $http({
            method: "POST",
            url: URL.BASE+"/allFakeGoodUsersThatSomeoneDo",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            console.log(response);
            Loader.hideLoading();
            defered.resolve(response);
            
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
         return defered.promise;
     };
 });

futronics.service('check_GlobalCommunity',function($rootScope,$ionicPopup,$state){
    this.check_memberOrNot=function(){
        
        if($rootScope.user_id == null || $rootScope.user_id == '' || $rootScope.user_id == undefined){
             $ionicPopup.show({
                template: 'You must make an account to have access to the community. ',
                title: '<p style="color:black"><b>Login/Signup</b></p>',
                //scope: $scope,
                buttons: [
                    {   
                        text: 'Back' ,
                        type: 'button-dark',
                        onTap: function(e) { 
                            return;
                        }
                    },
                    {   
                        text: 'Sign up' ,
                        type: 'button-calm',
                        onTap: function(e) { 
                            $state.go('signup');
                        }
                    }  
                ]
            });  

        }
    };
});

futronics.service('check_hideOrShow',function($rootScope,$q, $localstorage,URL,Loader,$http){
    this.hideShowLocalStorageValue=function(data){
        var hideshow_storagevalue;
         if($rootScope.isMaintain == 'false'){
             hideshow_storagevalue = "/checkIfHideShowCampaignWeightLoss";
        }else {
             hideshow_storagevalue = "/checkIfHideShowCampaignMaintence";
        }
      var defered=$q.defer();
    return $http({
            method: "POST",
            url: URL.BASE+hideshow_storagevalue,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            console.log(response+"hideshow_storagevalue");
            Loader.hideLoading();
            $localstorage.set("hideShowCampaign",response.data.result.weight_loss_hide_show_status);
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
    };
});

futronics.service('AfterEndCampaign',function($rootScope,$q, $localstorage,URL,Loader,$http){
    this.afterEndCampaignSetValues=function(data){
        var hideshow_storagevalue;
         if($rootScope.isMaintain == 'false'){
             end_storagevalue = "/checkIfCampaignCloseStatsWeightLoss";
        }else {
             end_storagevalue = "/checkIfCampaignCloseStatsMaintence";
        }
      var defered=$q.defer();
      return $http({
            method: "POST",
            url: URL.BASE+end_storagevalue,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){
            console.log(response+"end_storagevalue");
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
    };
});


futronics.service('MarketMyCampaign',function($rootScope,$q, $localstorage,URL,Loader,$http){
    // http://111.93.227.162/crowdfunding/fundingformaintencephase/funding/41
    this.shareMessageLink=function(id){
      var defered=$q.defer();
      return $http({
            method: "POST",
            url: URL.BASE+'/fundingformaintencephase/funding/'+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(response){
            console.log(response+"end_storagevalue");
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        },function(error){
            Loader.hideLoading();
            console.log(error+"error");
            defered.reject(error);
        });
    };
});