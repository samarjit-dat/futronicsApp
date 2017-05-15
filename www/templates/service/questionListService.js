futronics.service("QuestionOneService",function($http,$q,URL,$localstorage,Loader){
    this.FirstQuestion = function(data){
      Loader.showLoading();
      var defered=$q.defer();
       $http({
          method:"POST",
          url: URL.BASE+"/newCampainQuestionAnswer",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data:data
      }).then(function(response){
         var userInfo = {
            accessToken: response.data.access_token,
            userInfo: response.data
          };
          $localstorage.setObject("userInfo",userInfo);
          defered.resolve(response);
         
           Loader.hideLoading();
      },function(error){
         defered.reject(error); 
          Loader.hideLoading();
      });
       return defered.promise; 
        
    };
});

futronics.service('QuestionListService',function($http,$q,URL,Loader,$localstorage){
     this.QuestionList=function(){
        Loader.showLoading();
        var defered=$q.defer();
        $http({
            method: "GET",
            url: URL.BASE+"/questionList",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            
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
futronics.service("CountryListService",function($http,$q,URL,Loader){
  
    this.getCountry=function(dataUrl){
        Loader.showLoading();
        var defered=$q.defer();
        return $http({
          method:"POST",
          url: URL.BASE+"/"+dataUrl,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          
      }).then(function(response){
          Loader.hideLoading();
          //console.log('question response');
          //console.log(response);
          defered.resolve(response);
          return defered.promise;
         // return response;
           
      },function(error){
         
        defered.reject(error);
      });
  };
    
});