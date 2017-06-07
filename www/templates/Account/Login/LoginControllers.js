futronics.controller('LoginControllers', function($scope, $timeout,
    AccountService, $rootScope, Loader, $state, $ionicModal, $ionicPopup, $localstorage) {
    $scope.data = {};

    if (localStorage.isMaintainPhase === undefined) {
        $rootScope.isMaintain = localStorage.isMaintainPhase = false;
        $state.reload();
    }
    $ionicModal.fromTemplateUrl('templates/cashOutModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal_cashOut = modal;
    });

    $scope.login = function(data) {
        $scope.data = {
            username: data.username,
            user_password: data.password
        }
        var data = $rootScope.formatInputString($scope.data);
        Loader.showLoading();

        AccountService.login(data)
            .then(function(result) {
                if (result.userInfo.status === 0) {

                    Loader.hide(result.userInfo.message);
                } else {

                    $scope.userInfo = result;

                    Loader.hideLoading();

                    $rootScope.userId = result.userInfo.result[0].user_id;
                    localStorage.setItem('campaignCompleteOrNot', $rootScope.userId);
                    if ($localstorage.get('signup')) {
                        $localstorage.remove('signup');
                    }
                    if (result.userInfo.result.campaign.length > 0) {
                        var campaign_id = result.userInfo.result.campaign[0].campaign_id;
                        localStorage.setItem('campaign_id', campaign_id);
                    }

                    if (parseInt(result.userInfo.result[0].wallet) === 0) {
                        $scope.modal_cashOut.show();
                        $timeout(function() {
                            $scope.modal_cashOut.hide();
                        }, 10000);
                    }

                    if ($rootScope.previousState === 'campaignBrowse') {
                        $state.go('campaignBrowse');
                    } else if ($rootScope.previousState === 'account_settings') {
                        $state.go('account_settings');
                    } else {
                        $state.go('globalChat');
                    }
                }

            }, function(error) {
                Loader.hide(error.message);
            });
    }

    $scope.login_fingerprint = function() {
        toastr.error('we are currently working on it..');
        // if (ionic.Platform.isAndroid()) {
        // FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);
        // }
        // function isAvailableSuccess(result) {
        // console.log("FingerprintAuth available: " + JSON.stringify(result));
        // if (result.isAvailable) {
        //     // var encryptConfig = {}; // See config object for required parameters
        //     var encryptConfig = {
        //         clientId: "cordova-chatapp",
        //         username: "dakshesh",
        //         password: "daksh@123"
        //     };
        //     FingerprintAuth.encrypt(encryptConfig, encryptSuccessCallback, encryptErrorCallback);
        // }
        // }

        // function isAvailableError(message) {
        //     console.log("isAvailableError(): " + message);
        // }

        // function encryptSuccessCallback(result) {

        //     console.log("successCallback(): " + JSON.stringify(result));
        //     if (result.withFingerprint) {
        //         console.log("Successfully encrypted credentials.");
        //         console.log("Encrypted credentials: " + result.token);
        //     } else if (result.withBackup) {
        //         console.log("Authenticated with backup password");
        //     }
        // }

        // function encryptErrorCallback(error) {
        //     if (error === "Cancelled") {
        //         console.log("FingerprintAuth Dialog Cancelled!");
        //     } else {
        //         console.log("FingerprintAuth Error: " + error);
        //     }
        // }
    };

    $scope.signup = function() {
        $ionicPopup.show({
            template: '<rzslider rz-slider-model="slider.value"    rz-slider-on-click="getSliderVal()" rz-slider-options="slider.options"></rzslider>',
            title: '<p style="color:black"><b>What amount motivates you?</b></p>',
            buttons: [{
                    text: 'Cancel',
                    type: 'button-dark'
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-calm',
                    onTap: function(e) {
                        if ($rootScope.slider.value == undefined || $rootScope.slider.value == null || $rootScope.slider.value == 0) {
                            toastr.error('Motivation amount should be greater than 0');
                            return false;
                        }
                        $state.go("signup", { motivationAmount: $rootScope.slider.value });
                        return;
                    }
                }
            ]
        });
    }
});