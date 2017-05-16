futronics.controller('SignupControllers', function($scope,$rootScope, AccountService,$localstorage, $state,Loader,$ionicPopup,$stateParams) {
    
    $scope.isMaintainPhaseButton = localStorage.getItem('isMaintainPhase'); 
    
    if(localStorage.getItem('startnew')){
        $scope.start_new = localStorage.getItem('startnew');
    }
    if(!localStorage.getItem('startnew')){
        $scope.startnewEmpty = 'blank';
    }

    if($rootScope.slideValue != 0 && $rootScope.slideValue != undefined){
        $rootScope.slidingAmount = $rootScope.slideValue;
    }else if($rootScope.slideValue == undefined){
        $rootScope.slidingAmount = 0;
    }else {
        $rootScope.slidingAmount = 0;
    }

    $scope.data = {};
    $scope.roller = { checked: false };
    $rootScope.rollerSteps =5;
     
    $rootScope.slider = {
        value: 0,
        // value: $stateParams.motivationAmount,
        options:{
            floor: 10,ceil: 1000,step: 5,
            translate: function(value) {return '&dollar;' + value;},
            id: 'slideEnded',onEnd: $scope.myEndListener
        }
    }
        
    $scope.$on("slideEnded", function() {
       
        $rootScope.slidingAmount= $scope.slider.value;
        console.log($rootScope.slidingAmount);
    });

    $scope.rollerChange = function() {
        if(!$scope.roller.checked){$rootScope.slider = {
               
            value: $rootScope.slidingAmount,
            options:{
                floor: 0,ceil: 1000,step: 5,
                translate: function(value) {return '&dollar;' + value;},
                id: 'slideEnded',onEnd: $scope.myEndListener
            }
        };
        $rootScope.latestValue=1000;
        if($rootScope.slider.value>1000)$rootScope.slider.value=1000;}
        else{$rootScope.slider = {
            value: $rootScope.slidingAmount,
            options:{
                floor: 0,ceil: 50000,step: 5,
                translate: function(value) {return '&dollar;' + value;},
                id: 'slideEnded',onEnd: $scope.myEndListener
            }
        };
        $rootScope.latestValue=50000;}
    };
    
    $scope.signup = function(data) {
       
        
        if($stateParams.fromEndCampaign){
            var userData = JSON.parse(localStorage.getItem('userInfo'));
            userDataa = userData.userInfo.result[0];

            var _data={
                user_id: userDataa.user_id,
                card_no : data.cardNumber,
                cvv_code : data.cvv,
                city_zip : data.location,
                address : data.address,
                deposit_amount : $stateParams.motivationAmount,
                motivates_amount : $stateParams.motivationAmount,
                start_new_campaign_or_not: 0
            };

            var data=$rootScope.formatInputString(_data);
            AccountService.updateCardDetailsLogin(data).then(function (res) {
                
                if(res.data.status === 1){
                    userData.wallet = res.data.result.current_updated_amount_in_wallet;
                    localStorage.setItem("userInfo",JSON.stringify(userData));
                    localStorage.setItem("disableStartnewcampaign",userDataa.user_id+"disabled");
                    $state.go('campaignBrowse');
                }
            })
        }else{
            if($rootScope.slidingAmount === '0' || $rootScope.slidingAmount === 0){
                $ionicPopup.show({
                    template: 'Please choose deposit amount',
                    title: '<p style="color:black"><b>Attention</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'},

                    ]
                });
                }else{
                Loader.showLoading();
               
                $scope.data={
                    username:data.username,
                    user_password:data.password,
                    user_email:data.email,
                    card_no:data.cardNumber,
                    user_address:data.address,
                    user_location:data.location,
                    cvv:data.cvv,
                    deposit_amount: $rootScope.slidingAmount,
                    deposit_status:'1',
                    deposit_balanace : $rootScope.slidingAmount,
                    motivates_amount : $stateParams.motivationAmount,
                    start_new_campaign_or_not : 1
                }
                var data=$rootScope.formatInputString($scope.data)
                AccountService.signup(data)
                .then(function (result) {
                    if(result.userInfo.status===0){
                            Loader.hide(result.userInfo.message);
                    }else{
                        $scope.userInfo = result;
                        var uid=result.userInfo.result[0].user_id;
                        Loader.hideLoading();
                        localStorage.setItem('campaignCompleteOrNot',uid);
                        $localstorage.set('Welcome','1');
                        $localstorage.set('signup','1');
                        $state.go('campaignBrowse',{motivationAmount : $rootScope.slidingAmount});
                    }
                }, function (error) {
                    Loader.hide(error.message);
                });
            }
        }


    }

    $scope.commit=function(){
        $ionicPopup.show({
            template: ' lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
            title: '<p style="color:black"><b>Commit</b></p>',
            // subTitle: 'Please enter your weight using a point to indicate decimals',
            scope: $scope,
            buttons: [
            { text: 'Ok' ,
            type: 'button-calm'},

            ]
        });
    }
    
    $scope.Market=function(){
        $ionicPopup.show({
            template: ' lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
            title: '<p style="color:black"><b>Market</b></p>',
            // subTitle: 'Please enter your weight using a point to indicate decimals',
            scope: $scope,
            buttons: [
            { text: 'Ok' ,
            type: 'button-calm'},

            ]
        });
    }
    
    $scope.lose_Weight=function(){
        $ionicPopup.show({
            template: ' lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
            title: '<p style="color:black"><b>Lose Weight</b></p>',
            // subTitle: 'Please enter your weight using a point to indicate decimals',
            scope: $scope,
            buttons: [
            { text: 'Ok' ,
            type: 'button-calm'},

            ]
        });
    }
    $scope.doubleYourMoney=function(){
        $ionicPopup.show({
            template: ' lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
            title: '<p style="color:black"><b>Double Your Money </b></p>',
            // subTitle: 'Please enter your weight using a point to indicate decimals',
            scope: $scope,
            buttons: [
            { text: 'Ok' ,
            type: 'button-calm'},

            ]
        });
    }
});