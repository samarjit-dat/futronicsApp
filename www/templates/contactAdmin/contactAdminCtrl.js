futronics.controller('contactAdminCtrl', function($scope, ContactAdminSend, ContactAdminCatagory, $ionicPopup, $rootScope, AccountService, Loader, $state) {
    $scope.categories = [];
    $scope.adminText = '';
    ContactAdminCatagory.catagory().then(function(response) {
        $scope.categories = response.data.result.category;
    });
    $scope.getCategoryId = function(data) {
        $scope.categoryId = data;
    };

    $scope.sendMail = function(adminText) {
        var data = {
            category_id: $scope.categoryId,
            description: adminText
        };
        var data = $rootScope.formatInputString(data);
        ContactAdminSend.sendmail(data).then(function(response) {
            if (response.data.message == "Email Send Successfully To Admin. Thank you!") {
                $ionicPopup.show({
                    template: 'Your request has been sent successfully',
                    title: '<p style="color:black"><b>Contact Admin</b></p>',
                    scope: $scope,
                    buttons: [{
                        text: '<b>Ok</b>',
                        type: 'button-calm'
                    }]
                });
            } else {
                $ionicPopup.show({
                    template: 'Sorry!!something went wrong.Try again..',
                    title: '<p style="color:black"><b>Contact Admin</b></p>',
                    scope: $scope,
                    buttons: [{
                        text: '<b>Ok</b>',
                        type: 'button-calm'
                    }]
                });
            }
        });

    };
});