futronics.controller('addFundCtrl', 
    function($scope,StorageService,QuestionOneService,$rootScope,$window,
        $state,$localstorage,$ionicPopup,stateFactory,LogoutService,AddFundServices) {
            
        stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
       
        $scope.previoustate=$rootScope.previousState;  
        $scope.showRoller = false;

        $rootScope.slidingAmount=0;
        $scope.roller = { checked: false };
        $rootScope.slider = {
        value: $rootScope.slidingAmount,
        options:{
            floor: 0,ceil: 1000,step: 1,
            translate: function(value) {return  '$'+value;},
            id: 'slideEnded',onEnd: $scope.myEndListener
        }
    };

    $scope.$on("slideEnded", function() {
       
        $rootScope.slidingAmount= $scope.slider.value;
        console.log($rootScope.slidingAmount);
        
    }); 
    $scope.rollerChange = function() {
        if(!$scope.roller.checked){
            $rootScope.slider = {
                    
                value: $rootScope.slidingAmount,
                options:{
                    floor: 0,ceil: 1000,step: 5,
                    translate: function(value) {return '&dollar;' + value;},
                    id: 'slideEnded',onEnd: $scope.myEndListener
                }
            }
            $rootScope.latestValue=1000;
            if($rootScope.slider.value>1000) $rootScope.slider.value=1000;
        }
        else{
            $rootScope.slider = {
                value: $rootScope.slidingAmount,
                options:{
                    floor: 0,ceil: 50000,step: 5,
                    translate: function(value) {return '&dollar;' + value;},
                    id: 'slideEnded',onEnd: $scope.myEndListener
                }
            }
            $rootScope.latestValue=50000;
        }
        $scope.showRoller = $scope.roller.checked;
    };
    /* ******************** UserId from LocalStorage start***********************  */

    StorageService.storage();
    $scope.logout=function(){
        LogoutService.logout();
    };
    /* ******************** UserId from LocalStorage end***********************  */
    
    $scope.addFund=function(){
 
         if($rootScope.slidingAmount=='' || $rootScope.slidingAmount==null){
				$ionicPopup.show({
                    template: 'Please select the amount before proceed',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'
                       
                    }
                ]
            });  
        }else{
            $ionicPopup.prompt({
              title: 'Password Check',
              subTitle: 'Enter your secret password',
              inputType: 'password',
              inputPlaceholder: 'Your password'
            }).then(function(res) {
                console.log(res)
                if(res == undefined){
                    return;
                }else {
          
                    var data={
                        amount:$rootScope.slidingAmount,
                        user_id:$rootScope.userId,
                        password : res
                    };
                    var data=$rootScope.formatInputString(data);
                        
                    PaypalService.initPaymentUI().then(function () {
                        PaypalService.makePayment($rootScope.slidingAmount, "Total Amount").then(function (response) {
                            // alert("success"+JSON.stringify(response));


                            AddFundServices.addFund(data).then(function(response){
                            console.log('add fund response*************');
                            console.log(response);
                        
                                if(response==undefined){
                                    $ionicPopup.show({
                                                template: 'Sorry!!!you entered password may not be matched',
                                                title: '<p style="color:black"><b>Error!!!</b></p>',
                                                scope: $scope,
                                                buttons: [
                                                { text: 'Ok' ,
                                                type: 'button-calm'
                                                
                                                }
                                            ]
                                        });
                                }else { 

                                    if(response.data.message==='Fund Added Successfully!'){
                                        $ionicPopup.show({
                                                template: 'your fund added successfully',
                                                title: '<p style="color:black"><b>cheers</b></p>',
                                                scope: $scope,
                                                buttons: [
                                                { text: 'Ok' ,
                                                type: 'button-calm',
                                                onTap: function(e) {
                                                    $state.go($scope.previoustate);
                                                        return;
                                                    }
                                                
                                                }
                                            ]
                                        });
                                    }else{
                                        $ionicPopup.show({
                                                template: 'Sorry!!!Something went wrong,Try again',
                                                title: '<p style="color:black"><b>Error!!!</b></p>',
                                                scope: $scope,
                                                buttons: [
                                                { text: 'Ok' ,
                                                type: 'button-calm'
                                                
                                                }
                                            ]
                                        });
                                    }
                                }
                                
                            });


                        }, function (error) {
                            alert("Transaction Canceled");
                        });
                    });
                }
            });
        }
    };
});
