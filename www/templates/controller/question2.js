futronics.controller('question2Ctrl', 
    function($scope,StorageService,QuestionOneService,$rootScope,$state,$window,
    $localstorage,$ionicPopup,stateFactory,LogoutService) {

    stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
    
        $rootScope.slidingAmount=2.0;
        $rootScope.slider = {
        value: $rootScope.slidingAmount,
        options:{
            precision:1,floor: 2.0,ceil: 9.0,step: 0.1,
            translate: function(value) {
               
              
                //console.log('res slide');
                var number = value*10,
                output = [],
                sNumber = number.toString();

                for (var i = 0, len = sNumber.length; i < len; i += 1) {
                    output.push(+sNumber.charAt(i));
                }

                //console.log(output);
                //console.log(value);
                return output[0]+'ft'+output[1]+'in.';
                
            },
            id: 'slideEnded',onEnd: $scope.myEndListener
        }
    }
    
    $scope.$on("slideEnded", function() {
       
        $rootScope.slidingAmount= $scope.slider.value;
       // console.log($rootScope.slidingAmount);
        
    }); 
    /* ******************** UserId from LocalStorage start***********************  */
//    if(localStorage.getItem('userInfo')!==null){
//            var user_details=JSON.parse(localStorage.getItem('userInfo'));
//            $rootScope.userId=user_details.userInfo.result[0].user_id;
//            console.log('quse*******************');
//            console.log($scope.userId);
//        }

     StorageService.storage();
    /* ******************** UserId from LocalStorage end***********************  */
    $scope.logout=function(){
        LogoutService.logout();
    };
    $scope.myOwnProfile=function(){
          //alert('data');
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
   };
    $scope.question2=function(){
 
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
        }else if($rootScope.slidingAmount==1){
				$ionicPopup.show({
                    template: 'Please Say Your Height',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'
                       
                    }
                ]
            });  
		}else{
           // alert($rootScope.slidingAmount);
           var campaign_id=localStorage.getItem('campaign_id');
           //alert(campaign_id);
           var data={
                step_no:2,
                user_id:$rootScope.userId,
                answer:$rootScope.slidingAmount,
                to_id:$rootScope.to_id,
                campaign_id:campaign_id
            };
            var data=$rootScope.formatInputString(data);
            console.log('chjeck..........................');
            //console.log(data);
            QuestionOneService.FirstQuestion(data).then(function(response){
                console.log('questionCTRL2 response*************');
                console.log(response);
                //console.log(response.data.result.campaign_id);
                
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
                    //alert('else');
                    $state.go('question3');
                }
               
            })
        }
    }
})



