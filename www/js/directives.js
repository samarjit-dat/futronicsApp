futronics.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                    scope.$apply(function(){
                            scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
            }
        });
    };
});
futronics.directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }]);
 futronics.directive('imageSwap', [function () {
    return {
      restrict: 'EA',
      link: function (scope, elem, attrs,ctrl) {
        var profileMainImage = [];
        var innerHtml = attrs.src;
        var id = attrs.id;
        
        if(id){
           //profileMainImage = angular.element(document.getElementById(id));
           
            elem.bind('click', function() {
            profileMainImage['alt'] = attrs.videoUrl;  
            profileMainImage['src'] = innerHtml;
            if(attrs.videoUrl !== undefined) scope.openVideoModal(attrs.videoUrl);
            if(id !== undefined) scope.reportFakeVideo(attrs.id);
            if(id !== undefined) scope.reportGoodVideo(attrs.id);

          });
        }
        
      }
    };
}]);

futronics.directive('imageExist', ['$http','IMAGE',
  function ($http,IMAGE) {
    return {
      restrict: 'EA',
      link: function (scope, elem, attrs,ctrl) {
       $http({
            method : "GET",
            url : attrs.src
        }).then(function mySuccess(response) {
            return;
        }, function myError(response) {
            if(response.status === 404){
                
             
              scope.mainImage =  IMAGE.BASE_IMAGE;
             
            
            }
        });
      }
    };
}]);

futronics.directive('changeSvg', function ($rootScope) {
    return {
      restrict: 'EA',
      link: function (scope, elem, attrs) {
       
        var imagePath = attrs.ngSrc.split("/")[0];
        var imageName = attrs.ngSrc.split("/")[1];
        
        if($rootScope.isMaintain === 'true'){
          var imageArray = imageName.split('.');
          attrs.ngSrc = imagePath+"/"+imageArray[0]+".m."+imageArray[1];
        }

        if($rootScope.isMaintain === 'false'){
          attrs.ngSrc = imagePath+"/"+ imageName;
        }
      }
    };
});
futronics.directive('toggleColor',function(){
    return{
        restrict: 'EA',
        link :function(scope, elem, attrs) {
            elem.on('click',function(){
                var id = attrs.id;
                if (attrs.id == 'Aweful') {
                     scope.good = false;
                     scope.bad = false;;
                     scope.great = false;;
                } else if(attrs.id == 'Bad') {
                    scope.good = false;
                    scope.aweful = false;
                    scope.great = false;
                }
                 else if(attrs.id == 'Good') {
                    scope.bad = false;
                    scope.aweful = false;
                    scope.great = false;
                }
                 else {
                    scope.bad = false;
                    scope.aweful = false;
                    scope.good = false;
                }
                localStorage.setItem('aboutDay',id);
            })
           
        }
    };
});

futronics.directive('openChatPopup', function($timeout) {
 return {
  restrict: 'A',
    require: '?ngModel', // get a hold of NgModelController
    controller: function () {
      
    },
  link: function($scope, $elm, $attrs,$ctrl) {

    var contentDOM = $elm.children().children();

   $elm.bind('touchstart', function(evt) {
    $scope.longPress = true;
    $timeout(function() {
     if ($scope.longPress) {
    $scope.setChatUser($scope.message.id);
      $scope.$apply(function() {
       $scope.$eval($attrs.onLongPress);
      });
     }
    }, 1000);
   });

   $elm.bind('touchend', function(evt) {
    $scope.longPress = false;
    if ($attrs.onTouchEnd) {
     $scope.$apply(function() {
      $scope.$eval($attrs.onTouchEnd)
     });
    }
   });
  }
 };
})


futronics.directive('countdown', [
    'Util',
    '$interval',
    function (Util, $interval) {
        return {
            restrict: 'A',
            scope: { date: '@' },
            link: function (scope, element) {
                var future;
                future = new Date(scope.date);
                $interval(function () {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return element.text(Util.dhms(diff));
                }, 1000);
            }
        };
    }]).factory('Util', function () {
        return {
            dhms: function (t) {
                var days, hours, minutes, seconds;
                days = Math.floor(t / 86400);
                t -= days * 86400;
                hours = Math.floor(t / 3600) % 24;
                t -= hours * 3600;
                minutes = Math.floor(t / 60) % 60;
                t -= minutes * 60;
                seconds = t % 60;
                
                return [
                    Math.abs(days) + 'd',
                    hours + 'h',
                    minutes + 'm',
                    seconds + 's'
                ].join(' ');
            }
        };
    });

 futronics.directive('scrollToTop', function () {
    return {
      restrict: 'EA',
      scope: { setFn: '&' },
      link: function (scope, elem, attrs,ctrl) {
        scope.$on('scroll', function(event){
            console.log(elem[0].scrollHeight)
            elem[0].scrollTop = elem[0].scrollHeight;        
        })
      }
    }
 });