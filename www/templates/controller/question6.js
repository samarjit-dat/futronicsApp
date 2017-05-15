futronics.controller('question6Ctrl', 
    function($scope,$rootScope,$state,$ionicPopup,stateFactory,LogoutService){
      
   stateFactory.setCurrentState($state.current.name); // For getting value stateFactory.getCurrentState()       
   
    $scope.select=function(event){
    //alert(event.target.id);
     id=event.target.id;
    $rootScope.selectId=id;
    var myEl = angular.element( document.querySelector( '#'+id ) );
        alert(myEl.value);
    myEl.toggleClass('aboutDay');
    //event.preventDefault();
    if(id.toString()=='Aweful'){
         var bad=angular.element( document.querySelector( '#Bad' ) );
         bad.removeClass('aboutDay');
         var Good=angular.element( document.querySelector( '#Good' ) );
         Good.removeClass('aboutDay');
         var Great=angular.element( document.querySelector( '#Great' ) );
         Great.removeClass('aboutDay');
    }else if(id.toString()=='Bad'){
         var Aweful=angular.element( document.querySelector( '#Aweful' ) );
         Aweful.removeClass('aboutDay');
         var Good=angular.element( document.querySelector( '#Good' ) );
         Good.removeClass('aboutDay');
         var Great=angular.element( document.querySelector( '#Great' ) );
         Great.removeClass('aboutDay');
        
    }else if(id.toString()=='Good'){
         var Aweful=angular.element( document.querySelector( '#Aweful' ) );
         Aweful.removeClass('aboutDay');
         var Bad=angular.element( document.querySelector( '#Bad' ) );
         Bad.removeClass('aboutDay');
         var Great=angular.element( document.querySelector( '#Great' ) );
         Great.removeClass('aboutDay');
    }else{
         var Aweful=angular.element( document.querySelector( '#Aweful' ) );
         Aweful.removeClass('aboutDay');
         var Bad=angular.element( document.querySelector( '#Bad' ) );
         Bad.removeClass('aboutDay');
         var Good=angular.element( document.querySelector( '#Good' ) );
         Good.removeClass('aboutDay');
    }

    localStorage.setItem('aboutDay',id);
   
}

 $scope.myOwnProfile=function(){
          //alert('data');
          localStorage.removeItem('viewIndividualProfile_globalChat');
          localStorage.setItem('myProfile','1');
          $state.go('profile');
   };
   $scope.question6=function(){
       if(localStorage.getItem('aboutDay')){
           localStorage.removeItem('aboutDay');
           $state.go('question7');
       }else{
           $ionicPopup.show({
                    template: 'Please tell us about your day',
                    title: '<p style="color:black"><b>Attention!!!</b></p>',
                    scope: $scope,
                    buttons: [
                    { text: 'Ok' ,
                    type: 'button-calm'
                       
                    }
                ]
            });  
       }
       
   };
   $scope.logout=function(){
        LogoutService.logout();
   };
});