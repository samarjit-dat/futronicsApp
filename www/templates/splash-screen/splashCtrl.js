futronics.controller('splashCtrl', function($timeout, $scope, $state, $ionicHistory) {
    $timeout(function() {
        $state.go('globalChat');
    }, 13080);
})