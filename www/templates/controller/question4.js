futronics.controller('question4Ctrl', 
    function($scope,StorageService,QuestionOneService,$rootScope,$state,
        $window,$localstorage,$ionicPopup,stateFactory,LogoutService) {
            
    $scope.user={};
    
    stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
    $scope.logout=function(){
        LogoutService.logout();
    };
    $scope.myOwnProfile=function(){
          //alert('data');
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
   };
    $scope.question4=function(data){
        $scope.occupation=data.occupation;
    
     /* ******************** UserId from LocalStorage start***********************  */
//    if(localStorage.getItem('userInfo')!==null){
//            var user_details=JSON.parse(localStorage.getItem('userInfo'));
//            $rootScope.userId=user_details.userInfo.result[0].user_id;
//            console.log('quse*******************');
//            console.log($scope.userId);
//        }
        
    StorageService.storage();
    
    /* ******************** UserId from LocalStorage end***********************  */
    
    
    
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
        }else if($scope.occupation=='' || $scope.occupation==null){
				$ionicPopup.show({
                    template: 'Please Fill The Input Box',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'
                        
                    }
                ]
            });  
		}else{
           var campaign_id=localStorage.getItem('campaign_id');
           var data={
                step_no:4,
                user_id:$rootScope.userId,
                answer:$scope.occupation,
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
                   // alert('success4');
                    $state.go('question5');
                }
               
            })
        }
    
}
});
