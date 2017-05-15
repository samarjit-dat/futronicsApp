futronics.controller('question1Ctrl',
function($scope,StorageService,QuestionOneService,
$rootScope,$window,$state,$localstorage,$ionicPopup,LogoutService,stateFactory,
QuestionListService,$timeout,$ionicSlideBoxDelegate) {
     stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()
    if($localstorage.get('StartQuestion')){
        $ionicPopup.show({
        template: 'You need to answer these questions to finish your campaign up.',  
       
        title: '<p style="color:black"><b>Attention!!!</b></p>',
        scope: $scope,
        buttons: [
            { text: 'Ok' ,
                type: 'button-calm'
            }
          ]
        });
        $localstorage.remove('StartQuestion');
     }  
    StorageService.storage();
    $scope.logout=function(){
        LogoutService.logout();
    };
    $scope.questionLists=[];
    QuestionListService.QuestionList().then(function(response){
        console.log(response);
    $timeout(function(){
    for(var i=0;i<response.data.result.length;i++){
                $scope.questionLists.push(response.data.result[i]);
                $ionicSlideBoxDelegate.enableSlide(false);
                $ionicSlideBoxDelegate.update();
               
                
            }
        }, 1000);
    });
    
//    $scope.slideChanged = function(index) {
//       
//        var slide =  $ionicSlideBoxDelegate.currentIndex() - 1;
//        if($ionicSlideBoxDelegate.currentIndex() > slide){
//            return false;
//        }
//    };
    $scope.myOwnProfile=function(){
          //alert('data');
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
   };
    $rootScope.slidingAmount=50;
        $rootScope.slider = {
        value: $rootScope.slidingAmount,
        options:{
            floor: 50,ceil: 800,step: 1,
            translate: function(value) {return  value +'lbs';},
            id: 'slideEnded',onEnd: $scope.myEndListener
        }
    }
    
    $scope.$on("slideEnded", function(){
        $rootScope.slidingAmount= $scope.slider.value;
        localStorage.setItem('userWeight',$rootScope.slidingAmount);
    }); 
    /* ******************** UserId from LocalStorage start***********************  */
//    if(localStorage.getItem('userInfo')!==null){
//            var user_details=JSON.parse(localStorage.getItem('userInfo'));
//            $rootScope.userId=user_details.userInfo.result[0].user_id;
//            console.log('quse*******************');
//            console.log($scope.userId);
//        }


    /* ******************** UserId from LocalStorage end***********************  */
  
   

    $scope.question1=function(){
       $ionicSlideBoxDelegate.next();
        /*if(!$rootScope.userId){
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
        }else if($rootScope.slidingAmount==0){
				$ionicPopup.show({
                    template: 'Please Select Your Weight',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'
                       
                    }
                ]
            });  
		}else{
            var campaignId=localStorage.getItem('myCampaignId');
           var data={
                step_no:1,
                user_id:$rootScope.userId,
                answer:$rootScope.slidingAmount,
                to_id:$rootScope.to_id,
                campaign_id:campaignId
            }
            var data=$rootScope.formatInputString(data);
           // console.log('chjeck..........................');
            //console.log(data);
            QuestionOneService.FirstQuestion(data).then(function(response){
                console.log('questionCTRL response*************');
                console.log(response);
                //console.log(response.data.result.campaign_id);
                
                campaign_id=response.data.result.campaign_id;
               
                localStorage.setItem('campaign_id',campaign_id);
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
                    $state.go('question2');
                }
               
            })
        }*/
    }
})
