futronics.service("newsFeedServices",function($http,$q,URL){
    this.news = function(){
      var defered=$q.defer();
      return $http({
          method:"POST",
          url: URL.BASE+"/newsFeed",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
         
      }).then(function(response){
          //console.log('newsfeed response');
          //console.log(response);
          defered.resolve(response);
          return defered.promise; 
      },function(error){
         defered.reject(error); 
      });
    };
});
