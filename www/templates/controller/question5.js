futronics.controller('question5Ctrl', 
    function($scope,$http,URL,StorageService,QuestionOneService,$rootScope,
        $state,$window,$localstorage,$ionicPopup,stateFactory,LogoutService) {
            
    stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()       
    $scope.logout=function(){
        LogoutService.logout();
    };        
    $scope.getCountryName=function(data){
        //alert('hi');
        console.log('$scope.selectedName');
        console.log(data);
        
         $scope.countryName=data.country_name;
       
    }
    $scope.myOwnProfile=function(){
          //alert('data');
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
   };
    
    $scope.question5=function(){
   
    // alert($scope.countryName);
    
    if(!$scope.countryName){
        $ionicPopup.show({
                    template: 'Please select your country',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'
                   
                    }
                ]
            });
    }else{
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
        }else if($scope.countryName=='' ||  $scope.countryName==null){
				$ionicPopup.show({
                    template: 'Please Select Country',
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
                step_no:5,
                user_id:$rootScope.userId,
                answer:$scope.countryName,
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
                   // alert('success5');
                    $state.go('question6');
                }
               
            })
        }
      }
    }
   
    $scope.countries =[];

        return $http({
          method:"POST",
          url: URL.BASE+"/countryList",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          
      }).then(function(response){
          //Loader.hideLoading();
          console.log('question response');
          console.log(response);
         // alert(response.data.result.length);
          for(var i=0;i<response.data.result.length;i++){
              $scope.countries.push(response.data.result[i]);
          }
      },function(error){
         conole.log(error); 
      })
      
   
    
})
