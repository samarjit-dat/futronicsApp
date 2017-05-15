futronics.controller('question8Ctrl', 
    function($scope,StorageService,QuestionOneService,$rootScope,$window,$state,
    $localstorage,$ionicPopup,stateFactory,LogoutService) {
        
        stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
        
        $rootScope.slidingAmount=1;
        $rootScope.slider = {
        value: $rootScope.slidingAmount,
        options:{
            floor: 1,ceil: 200,step: 1,
            translate: function(value) { if(value==1){ return value +'Day'} else { return value +'Days'} ;},
            id: 'slideEnded',onEnd: $scope.myEndListener
        }
    }
    
    $scope.$on("slideEnded", function() {
       
        $rootScope.slidingAmount= $scope.slider.value;
        console.log($rootScope.slidingAmount);
        
    }); 
    /* ******************** UserId from LocalStorage start***********************  */
//    if(localStorage.getItem('userInfo')!==null){
//            var user_details=JSON.parse(localStorage.getItem('userInfo'));
//            $rootScope.userId=user_details.userInfo.result[0].user_id;
//            console.log('quse*******************');
//            console.log($scope.userId);
//        }
       StorageService.storage();
       $scope.logout=function(){
        LogoutService.logout();
       };

       $scope.myOwnProfile=function(){
          //alert('data');
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
    };
    /* ******************** UserId from LocalStorage end***********************  */
   
    $scope.question8=function(){
 
       
           var campaign_id=localStorage.getItem('campaign_id');
           var data={
                step_no:7,
                user_id:$rootScope.userId,
                answer:$rootScope.slidingAmount,
                to_id:$rootScope.to_id,
                campaign_id:campaign_id
            }
            var data=$rootScope.formatInputString(data);
            console.log('chjeck..........................');
            console.log(data);
            QuestionOneService.FirstQuestion(data).then(function(response){
                console.log('questionCTRL response*************');
                console.log(response);
                console.log(response.data.result.campaign_id);

                if(!response.data.result.campaign_id){
                            $ionicPopup.show({
                            template: 'Sorry!!!Something went wrong,Try again',
                            title: '<p style="color:black"><b>Error!!!</b></p>',
                            scope: $scope,
                            buttons: [
                            { text: 'Ok' ,
                            type: 'button-calm',
                                onTap: function(e) {
                                  $state.go("globalChat");
                                      return;

                              }
                            }
                        ]
                    });
                }else{
                    //alert('success');
                    localStorage.setItem('campaign_duration',$rootScope.slidingAmount);
                    $state.go('upload-video');
                   
                }
               
            })
        
    }
})



