futronics.controller('WithdrawCaloryAndCashCtrl',
    function($scope,$rootScope,AccountService,UserListService,check_GlobalCommunity,
    $ionicHistory,StorageService,$ionicModal,$sce,$http,$state,
    $window,$localstorage,$ionicPopup,URL,$location,IMAGE,$stateParams,CaloryService ) {


    var user_id = JSON.parse(localStorage.getItem('userInfo')).userInfo.result[0].user_id;

    $scope.showCashAndCalory = $stateParams.showCashAndCalory;
    $rootScope.slidingAmountcalory=0;

        $rootScope.slider = {
        val: $rootScope.slidingAmount || 0,

        options:{

            floor: 0,ceil: 600,step: 1,
            translate: function(val) {return '$'+ val ;},
            id: 'slideEnded',onEnd: $scope.myEndListener
        }
    }


    $scope.$on("$ionicView.enter", function() {
       $scope.slider.val=0;
       $scope.slider.value=0;
       //$scope.totalAmount=0;

    });
    $scope.$on("slideEnded", function() {

        $rootScope.slidingAmountcalory= $scope.slider.val;
        console.log($rootScope.slidingAmount);
        //alert($scope.slider.val);


    });
    $scope.allCalories=function(){
        $scope.slider.val= $rootScope.slider.options.ceil;
    };

    $rootScope.slidingAmountCash=0;
        $rootScope.slider = {
        value: $rootScope.slidingAmount || 0,
        options:{
            floor: 0,ceil: 600,step: 1,
            translate: function(value) {return '$'+ value ;},
            id: 'slideEnded',onEnd: $scope.myEndListener
        }
    }

    $scope.$on("slideEnded", function() {

        $rootScope.slidingAmountCash= $scope.slider.value;
        console.log($rootScope.slidingAmount);

    });
     $scope.allCash=function(){
        $scope.slider.value= $rootScope.slider.options.ceil;
    };



  $scope.selectCashAndCalories=function(type){
        if(type === 1){
            CaloryService.withdrawCash($rootScope.formatInputString({
                user_id : user_id,
                withdraw_money_amount : $scope.slider.value
            })).then(function(res){
                console.clear();
                console.log(" Cash ");

                var user_info = JSON.parse(localStorage.getItem("userInfo"));
                user_info.userInfo.result.wallet = res.data.result.current_updated_money;
                var update_userInfo=JSON.stringify(user_info);
                localStorage.setItem("userInfo",update_userInfo);
                console.log(JSON.parse(localStorage.getItem("userInfo")));
            });
        }

        if(type === 2){
            CaloryService.withdrawCalories($rootScope.formatInputString({
                user_id : user_id,
                withdraw_calorie_amount : $scope.slider.val
            })).then(function(res){
                console.clear();
                console.log(" Calory ");

                var user_info = JSON.parse(localStorage.getItem("userInfo"));
                user_info.userInfo.result.calories = res.data.result.updated_calorie_amount;
                var update_userInfo=JSON.stringify(user_info);
                localStorage.setItem("userInfo",update_userInfo);
                console.log(JSON.parse(localStorage.getItem("userInfo")));
            });
        }
         $ionicPopup.show({
                    template: '$'+ (parseInt($scope.slider.val) + parseInt($scope.slider.value) )+' is being deposited back to your bank account.You can see your current balance in my stats page <br/><br/>Sincerely,<br/><br/>DietMoney Team',
                    scope: $scope,
                    cssClass:"custom-popup",
                    buttons: [
                    { text: 'exit' ,
                    type: '',
                      onTap: function(e) {
                          $ionicHistory.clearCache();
                          $state.go("profile");
                              return;

                      }
                    }

                    ]
        });
    };

   });
