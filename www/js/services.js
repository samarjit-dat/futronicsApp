futronics.service("ContributionServices", function($http, $q, $localstorage, URL, Loader, $rootScope) {
    this.contribute = function(data) {
        Loader.showLoading();
        var contributeApi;
        if ($rootScope.isMaintain == 'false') {
            contributeApi = "/contributionApi";
        } else {
            contributeApi = "/maintencePhaseContribution";
        }
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + contributeApi,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            if ($rootScope.isMaintain == 'false') {
                var userInfo = {
                    accessToken: response.data.access_token,
                    userInfo: response.data
                };
                $localstorage.setObject("userInfo", userInfo);
            }
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            console.log(error + "error");
            defered.reject(error);
        });
    };

    this.whomeIContributed = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/userAllContributionList',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            defered.reject(error);
        });
    };
});
futronics.service('AddFundServices', function($http, $q, URL, Loader, $localstorage) {
    this.addFund = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + "/addingFundToUserWallet",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            if (response.data.message == 'Fund Added Successfully!') {
                var user_info = JSON.parse(localStorage.getItem("userInfo"));
                user_info.userInfo.result.wallet = response.data.result.wallet;
                var update_userInfo = JSON.stringify(user_info);
                localStorage.setItem("userInfo", update_userInfo);
            }
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

    };
});

futronics.service('ContactAdminCatagory', function($http, $q, URL, Loader, $localstorage) {
    this.catagory = function() {
        Loader.showLoading();
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + "/adminContactCategory",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('ContactAdminSend', function($http, $q, URL, Loader, $localstorage) {
    this.sendmail = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + "/contactWithAdminMail",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});


futronics.service('MaintainService', function($http, $q, URL, Loader, $localstorage) {
    this.maintainPhase = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + "/campaignInMaintenancePhase",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('FakeVideoService', function($http, $q, URL, Loader, $localstorage, $rootScope) {
    this.fakeVideo = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        var fakeVideoUrl;
        if ($rootScope.isMaintain == 'false') {
            fakeVideoUrl = "/reportFakeRequest";
        } else {
            fakeVideoUrl = "/maintencePhaseFakeReportRequest";
        }
        return $http({
            method: "POST",
            url: URL.BASE + fakeVideoUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('GoodVideoService', function($http, $q, URL, Loader, $localstorage) {
    this.goodVideo = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + "/videoMarkedAsGood",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});


futronics.service('FakevideoReportList', function($http, $q, URL, Loader, $localstorage) {
    this.list = function() {
        Loader.showLoading();
        var defered = $q.defer();
        return $http({
            method: "GET",
            url: URL.BASE + "/fakeVideoReportOptions",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            defered.reject(error);
        });
    };
});

futronics.service('GlobalChatService', function($http, $q, URL, Loader, $rootScope) {
    this.addFriend = function(_data) {
        Loader.showLoading();
        var defered = $q.defer();

        $http({
            method: "POST",
            url: URL.BASE + "/addFriendRequest",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: _data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    };

    this.giveCalory = function(_data) {
        Loader.showLoading();
        var defered = $q.defer();

        $http({
            method: "POST",
            url: URL.BASE + "/provideCaloriesToUser",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: _data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    };

    this.reportUser = function(_data) {
        Loader.showLoading();
        var defered = $q.defer();

        $http({
            method: "POST",
            url: URL.BASE + "/reportUsers",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: _data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    };

    this.getReportUsersList = function(_data) {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/allReportedUsersList",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: _data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    };

    this.getMutedTime = function() {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "GET",
            url: URL.BASE + "/userMuteApi",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    };
});


futronics.service('CaloryService', function($http, $q, URL, Loader) {
    this.getCaloryList = function() {
        Loader.showLoading();
        var defered = $q.defer();

        $http({
            method: "GET",
            url: URL.BASE + "/caloriesListing",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    };

    this.purchaseCalory = function(_data) {
        Loader.showLoading();
        var defered = $q.defer();

        $http({
            method: "POST",
            url: URL.BASE + "/purchaseCalorie",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: _data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    }

    this.withdrawCalories = function(_data) {
        Loader.showLoading();
        var defered = $q.defer();

        $http({
            method: "POST",
            url: URL.BASE + "/withdrawCalories",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: _data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    }

    this.withdrawCash = function(_data) {
        Loader.showLoading();
        var defered = $q.defer();

        $http({
            method: "POST",
            url: URL.BASE + "/withdrawCash",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: _data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });

        return defered.promise;
    }

});

futronics.service('SponsorsAcquired', function($http, $q, URL, Loader, $localstorage) {
    this.contributionToMe = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/listOfUsersContributedToAccount",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);

        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
        return defered.promise;
    };
});

futronics.service('WeightLoseSuccessOrFail', function($http, $q, URL, Loader, $localstorage) {
    this.SuccessOrFail = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/weightLossPhaseSuccessFail",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();

            defered.resolve(response);

        }, function(error) {
            Loader.hideLoading();
            console.log(error);
            defered.reject(error);
        });
        return defered.promise;
    };
});


futronics.service('ViewMyStats', function($http, $q, URL, Loader, $localstorage) {
    this.getDetails = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/myUserCampaignAllDetails",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            defered.reject(error);
        });
        return defered.promise;
    };
});

futronics.directive('toggleColor', function() {
    return {
        restrict: 'EA',
        link: function(scope, elem, attrs) {
            elem.on('click', function() {
                scope.classadd = 1;
                var id = attrs.id;
                if (attrs.id == 'Aweful') {
                    scope.good = false;
                    scope.bad = false;
                    scope.great = false;
                } else if (attrs.id == 'Bad') {
                    scope.good = false;
                    scope.aweful = false;
                    scope.great = false;
                } else if (attrs.id == 'Good') {
                    scope.bad = false;
                    scope.aweful = false;
                    scope.great = false;
                } else {
                    scope.bad = false;
                    scope.aweful = false;
                    scope.good = false;
                }
                localStorage.setItem('aboutDay', id);
            })

        }
    };
});

futronics.service('HideCampaign', function($http, $q, $localstorage, URL, $rootScope) {
    this.userHideCampaign = function(data) {
        var hideCampaignUrl;
        if ($rootScope.isMaintain == 'false') {
            hideCampaignUrl = "/hidetheCampain";
        } else {
            hideCampaignUrl = "/hidetheCampainMaintence";
        }
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + hideCampaignUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            var user_info = JSON.parse(localStorage.getItem("userInfo"));
            user_info.userInfo.result.campaign[0].campaign_status = "2";
            var update_userInfo = JSON.stringify(user_info);
            localStorage.setItem("userInfo", update_userInfo);

            var all_user_details = JSON.parse(localStorage.getItem("allUserDetails"));
            for (var i = 0; i < all_user_details.length; i++) {
                if (all_user_details[i].campaign.length > 0) {
                    if (all_user_details[i].campaign[0].user_id == user_info.userInfo.result[0].user_id) {
                        all_user_details[i].campaign[0].campaign_status = "2";
                        var updated_allUserDetails = JSON.stringify(all_user_details);
                        localStorage.setItem("allUserDetails", updated_allUserDetails);
                    }
                }
            }
            defered.resolve(response);

        }, function(error) {
            defered.reject(error);
        });
        return defered.promise;
    };
});

futronics.service('ShowCampaign', function($http, $q, $localstorage, URL, $rootScope) {
    this.userShowCampaign = function(data) {
        var showCampaignUrl;
        if ($rootScope.isMaintain == 'false') {
            showCampaignUrl = "/showtheCampain";
        } else {
            showCampaignUrl = "/showtheCampainMaintence";
        }
        var defered = $q.defer();

        $http({
            method: "POST",
            url: URL.BASE + showCampaignUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            var user_info = JSON.parse(localStorage.getItem("userInfo"));
            user_info.userInfo.result.campaign[0].campaign_status = "1";
            var update_userInfo = JSON.stringify(user_info);
            localStorage.setItem("userInfo", update_userInfo);

            var all_user_details = JSON.parse(localStorage.getItem("allUserDetails"));
            for (var i = 0; i < all_user_details.length; i++) {
                if (all_user_details[i].campaign.length > 0) {
                    if (all_user_details[i].campaign[0].user_id == user_info.userInfo.result[0].user_id) {
                        all_user_details[i].campaign[0].campaign_status = "1";
                        var updated_allUserDetails = JSON.stringify(all_user_details);
                        localStorage.setItem("allUserDetails", updated_allUserDetails);
                    }
                }
            }
            defered.resolve(response);

        }, function(error) {
            defered.reject(error);
        });
        return defered.promise;
    };
});

futronics.service('CaloryHaveOrGiven', function($http, $q, URL, Loader, $localstorage) {
    this.calories = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/calorieUserLeftandUsed",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);

        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
        return defered.promise;
    };
});


futronics.service('FakeOrGood', function($http, $q, URL, Loader, $localstorage) {
    this.getArrayList = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/allFakeGoodUsersThatSomeoneDo",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);

        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
        return defered.promise;
    };
});

futronics.service('check_GlobalCommunity', function($rootScope, $stateParams, $ionicPopup, $state) {
    this.check_memberOrNot = function() {
        $stateParams.motivationAmount = null;
        if ($rootScope.user_id == null || $rootScope.user_id == '' || $rootScope.user_id == undefined) {
            $ionicPopup.show({
                template: 'You must make an account to have access to the community. ',
                title: '<p style="color:black"><b>Login/Signup</b></p>',
                buttons: [{
                        text: 'Back',
                        type: 'button-dark',
                        onTap: function(e) {
                            return;
                        }
                    },
                    {
                        text: 'Sign up',
                        type: 'button-calm',
                        onTap: function(e) {
                            $ionicPopup.show({
                                template: '<rzslider rz-slider-model="slider.value"    rz-slider-on-click="getSliderVal()" rz-slider-options="slider.options"></rzslider>',
                                title: '<p style="color:black"><b>What amount motivates you?</b></p>',
                                buttons: [

                                    {
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
                    }
                ]
            });

        }
    };
});

futronics.service('check_hideOrShow', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    this.hideShowLocalStorageValue = function(data) {
        var hideshow_storagevalue;

        if ($rootScope.isMaintain == 'false' || $rootScope.isMaintain == undefined) {
            hideshow_storagevalue = "/checkIfHideShowCampaignWeightLoss";
        }
        if ($rootScope.isMaintain == 'true') {
            hideshow_storagevalue = "/checkIfHideShowCampaignMaintence";
        }
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + hideshow_storagevalue,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            //$localstorage.set("hideShowCampaign", response.data.result.weight_loss_hide_show_status);
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('AfterEndCampaign', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    this.afterEndCampaignSetValues = function(data) {
        var hideshow_storagevalue;
        if ($rootScope.isMaintain == 'false') {
            end_storagevalue = "/checkIfCampaignCloseStatsWeightLoss";
        } else {
            end_storagevalue = "/checkIfCampaignCloseStatsMaintence";
        }
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + end_storagevalue,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});


futronics.service('MotivationPercent', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    this.getPercent = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/motivationPercentCampaignRunning',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.factory('PaypalService', ['$q', '$ionicPlatform', 'shopSettings', '$filter', '$timeout', function($q, $ionicPlatform, shopSettings, $filter, $timeout) {
    var init_defer;
    /**
     * Service object
     * @type object
     */
    var service = {
        initPaymentUI: initPaymentUI,
        createPayment: createPayment,
        configuration: configuration,
        onPayPalMobileInit: onPayPalMobileInit,
        makePayment: makePayment
    };


    /**
     * @ngdoc method
     * @name initPaymentUI
     * @methodOf app.PaypalService
     * @description
     * Inits the payapl ui with certain envs.
     *
     *
     * @returns {object} Promise paypal ui init done
     */
    function initPaymentUI() {

        init_defer = $q.defer();
        $ionicPlatform.ready().then(function() {

            var clientIDs = {
                "PayPalEnvironmentProduction": shopSettings.payPalProductionId,
                "PayPalEnvironmentSandbox": shopSettings.payPalSandboxId
            };

            if (ionic.Platform.isAndroid()) {
                PayPalMobile.init(clientIDs, onPayPalMobileInit);
            }
        });

        return init_defer.promise;

    }


    /**
     * @ngdoc method
     * @name createPayment
     * @methodOf app.PaypalService
     * @param {string|number} total total sum. Pattern 12.23
     * @param {string} name name of the item in paypal
     * @description
     * Creates a paypal payment object
     *
     *
     * @returns {object} PayPalPaymentObject
     */
    function createPayment(total, name) {

        // "Sale  == >  immediate payment
        // "Auth" for payment authorization only, to be captured separately at a later time.
        // "Order" for taking an order, with authorization and capture to be done separately at a later time.
        var payment = new PayPalPayment("" + total, "EUR", "" + name, "Sale");
        return payment;
    }
    /**
     * @ngdoc method
     * @name configuration
     * @methodOf app.PaypalService
     * @description
     * Helper to create a paypal configuration object
     *
     *
     * @returns {object} PayPal configuration
     */
    function configuration() {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({ merchantName: shopSettings.payPalShopName, merchantPrivacyPolicyURL: shopSettings.payPalMerchantPrivacyPolicyURL, merchantUserAgreementURL: shopSettings.payPalMerchantUserAgreementURL });
        return config;
    }

    function onPayPalMobileInit() {
        $ionicPlatform.ready().then(function() {
            // must be called
            // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
            PayPalMobile.prepareToRender(shopSettings.payPalEnv, configuration(), function() {
                $timeout(function() {
                    init_defer.resolve();
                });
            });
        });
    }

    /**
     * @ngdoc method
     * @name makePayment
     * @methodOf app.PaypalService
     * @param {string|number} total total sum. Pattern 12.23
     * @param {string} name name of the item in paypal
     * @description
     * Performs a paypal single payment
     *
     *
     * @returns {object} Promise gets resolved on successful payment, rejected on error
     */
    function makePayment(total, name) {


        var defer = $q.defer();
        total = $filter('number')(total, 2);
        $ionicPlatform.ready().then(function() {
            PayPalMobile.renderSinglePaymentUI(createPayment(total, name), function(result) {
                $timeout(function() {
                    defer.resolve(result);
                });
            }, function(error) {
                $timeout(function() {
                    defer.reject(error);
                });
            });
        });

        return defer.promise;
    }

    return service;
}]);

futronics.service('NotificationSettings', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    this.get = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/get_notification_data',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };

    this.set = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/upd_notification_data',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };

    this.sendmail = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/send_email_notify_msg',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('checkingCurrentState', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    Loader.showLoading();
    this.post = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/update_curr_state',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {

            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };


    this.get = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/get_curr_state',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('checkingActualState', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    Loader.showLoading();
    this.post = function(data) {

        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/update_actual_state',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {

            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };


    this.get = function(data) {

        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/get_actual_state',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('StartNewCampaign', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    this.isActive = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/get_user_status',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
    this.updateStatus = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/upd_user_status',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('RefState', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    Loader.showLoading();
    this.post = function(data) {

        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/upd_ref_status',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
    this.get = function(data) {

        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/get_ref_status',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('EndCampaignStatus', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    Loader.showLoading();
    this.post = function(data) {

        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/upd_end_camp_stat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
    this.get = function(data) {

        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/get_camp_stat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service('FingerprintServices', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    this.registerToken = function(data) {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + '/fingerprint_token_register',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});

futronics.service("LocalStorageRemoveService",
    function($localstorage, $ionicPopup, StorageService, $state, $rootScope) {
        this.storageRemove = function() {
            $localstorage.remove('otherProfileDetails');
            $localstorage.remove('otherUserCampaignId');
            $localstorage.remove('isMaintainPhase');
            $localstorage.remove('campaignCompleteOrNot');
            $localstorage.remove('campaign_id');
            $localstorage.remove('ShowAlertForMaintenancePhase');
            $localstorage.remove('newsFeed');
            $localstorage.remove('hideShowCampaign');
            $localstorage.remove('myProfile');
            $localstorage.remove('viewIndividualProfile_globalChat');
            $localstorage.remove('startNew');
            $localstorage.remove('currentSate');
            $localstorage.remove('actualState');
            $localstorage.remove('refrstate');
            $localstorage.remove('hideShowCampaign');
        };
    });

futronics.service("LogoutService",
    function($localstorage, $ionicPopup, StorageService,
        LocalStorageRemoveService, $state, $rootScope) {
        this.logout = function() {
            var userInfo = null;
            var buttonType = 'button-calm';

            if ($rootScope.isMaintain == 'true') {
                buttonType = 'button-calm gold-bg'
            }

            $localstorage.remove('userInfo');
            if (userInfo == "" || userInfo == null) {
                $ionicPopup.show({
                    template: 'You successfully logged out',
                    title: '<p style="color:black"><b>Logout</b></p>',
                    buttons: [{
                            text: 'Cancel',
                            type: 'button-dark'
                        },
                        {
                            text: 'Ok',
                            type: buttonType,
                            onTap: function(e) {
                                StorageService.storage();
                                LocalStorageRemoveService.storageRemove();
                                $state.go('login');
                                return;
                            }
                        }
                    ]
                });
            }
        };
    });

futronics.service("newsFeedServices", function($http, $q, $ionicPopup, URL, Loader) {
    this.news = function() {
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + "/newsFeed",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).then(function(response) {
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            defered.reject(error);
        });
    };
});

futronics.service("QuestionOneService", function($http, $q, URL, $localstorage, Loader) {
    this.FirstQuestion = function(data) {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "POST",
            url: URL.BASE + "/newCampainQuestionAnswer",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            var userInfo = {
                accessToken: response.data.access_token,
                userInfo: response.data
            };
            $localstorage.setObject("userInfo", userInfo);
            defered.resolve(response);
            Loader.hideLoading();
        }, function(error) {
            defered.reject(error);
            Loader.hideLoading();
        });
        return defered.promise;
    };
});

futronics.service('QuestionListService', function($http, $q, URL, Loader, $localstorage) {
    this.QuestionList = function() {
        Loader.showLoading();
        var defered = $q.defer();
        $http({
            method: "GET",
            url: URL.BASE + "/questionList",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
        return defered.promise;
    };
});
futronics.service("CountryListService", function($http, $q, URL, Loader) {
    this.getCountry = function(dataUrl) {
        Loader.showLoading();
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + "/" + dataUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

        }).then(function(response) {
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            defered.reject(error);
        });
    };

});

futronics.service("UserListService", function($http, $ionicPopup, $q, Loader, $localstorage, URL, $rootScope) {
    this.userListOnLoad = function(data) {
        var defered = $q.defer();
        Loader.showLoading();
        return $http({
            method: "POST",
            url: URL.BASE + "/userList",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            if (response.data.status == 2) {
                if ($rootScope.currentState == "globalChat" && $rootScope.noMore++ < 1) {
                    var loadMoreId = document.getElementById('loadMore');
                    if ($rootScope.previousState != 'splash' || $rootScope.previousState != '') {
                        toastr.error('No more data available');
                    }
                    $rootScope.nomoredata_flag = 1;
                }
            }
            defered.resolve(response);
            Loader.hideLoading();
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            $ionicPopup.show({
                template: 'Sorry, Slow server connectivity detected. Please wait a while or try again.',
                title: 'Slow  Connection',
                buttons: [{
                        text: 'Cancel',
                        type: 'button-dark'
                    },
                    {
                        text: '<b>Ok</b>',
                        type: 'button-calm',
                        onTap: function(e) {

                            ionic.Platform.exitApp();
                        }
                    }
                ]

            });
            defered.reject(error);
        });

    };
});

futronics.service("StorageService", function($rootScope, $localstorage, IMAGE, RefState) {
    this.storage = function() {

        if (localStorage.getItem('userInfo') !== null) {

            $rootScope.user_id = '';
            $rootScope.noImage = IMAGE.BASE_IMAGE;
            $rootScope.user = JSON.parse(localStorage.getItem('userInfo'));
            if ($rootScope.user.userInfo.result[0].user_id != null || $rootScope.user.userInfo.result[0].user_id != '') {
                $rootScope.user_id = $rootScope.user.userInfo.result[0].user_id;
                $rootScope.start_date = $rootScope.user.userInfo.result[0].add_date;
                $rootScope.walletValue = $rootScope.user.userInfo.result.wallet;
                $rootScope.checkloginuserornot = $rootScope.user_id;
                /* 31.03 */
                if ($rootScope.user.userInfo.result.campaign.length != 0) {
                    $rootScope.campaign_datetime = $rootScope.user.userInfo.result.campaign[0].campaign_datetime;
                    $rootScope.campaign_date = $rootScope.campaign_datetime.split(' ');
                    $rootScope.goal = $rootScope.user.userInfo.result.campaign[0].proposed_weight;
                    $rootScope.currentWeight = $rootScope.user.userInfo.result.campaign[0].current_weight;
                    $rootScope.campaign_status = $rootScope.user.userInfo.result.campaign[0].campaign_status;
                    $rootScope.runningCampaign_id = $rootScope.user.userInfo.result.campaign[0].campaign_id;

                }
                if ($rootScope.user.userInfo.result.profile_videos.length > 0) {

                    $rootScope.profile_complete_show_progress = '1';
                    if (localStorage.getItem('actualState')) {
                        var _state = localStorage.getItem('actualState');

                        var u = 1;
                        var q = 2;
                        var o = 3;
                        if ((_state == 'upload-video')) {

                            var param = { user_id: $rootScope.user_id, ref_status: u };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 1);
                                } else {
                                    return false;
                                }
                            });
                        } else if ((_state == 'questions')) {
                            var param = { user_id: $rootScope.user_id, ref_status: q };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 2);
                                } else {
                                    return false;
                                }
                            });

                        } else if ((_state == 'campaignBrowse') || (_state == 'contribution') ||
                            (_state == 'thanksAfterContribution')) {
                            var param = { user_id: $rootScope.user_id, ref_status: o };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 3);
                                } else {
                                    return false;
                                }

                            })
                        } else {

                            if ($rootScope.user.userInfo.result.campaign.length != 0) {
                                if ($rootScope.campaign_status == 0) {
                                    var param = { user_id: $rootScope.user_id, ref_status: o };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 3);
                                        } else {
                                            return false;
                                        }
                                    })

                                } else if ((_state == 'upload-video') && ($rootScope.campaign_status == 1)) {
                                    var param = { user_id: $rootScope.user_id, ref_status: u };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 1);
                                        } else {
                                            return false;
                                        }

                                    })

                                } else {
                                    if (localStorage.getItem('actualState')) {
                                        var _stateSub = localStorage.getItem('actualState');
                                        if (_stateSub == 2 || _stateSub == 'questions') {
                                            var param = { user_id: $rootScope.user_id, ref_status: q };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {
                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 2);
                                                } else {
                                                    return false;
                                                }

                                            })
                                        }
                                        if (_stateSub == 1 || _stateSub == 'upload-video') {
                                            var param = { user_id: $rootScope.user_id, ref_status: u };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {

                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 1);
                                                } else {
                                                    return false;
                                                }

                                            })
                                        }
                                    } else {
                                        var param = { user_id: $rootScope.user_id, ref_status: o };
                                        var data = $rootScope.formatInputString(param);
                                        RefState.post(data).then(function(response) {
                                            if (response.data.status == 1) {
                                                localStorage.setItem("refrstate", 3);
                                            } else {
                                                return false;
                                            }
                                        })
                                    }

                                }
                            } else {
                                var param = { user_id: $rootScope.user_id, ref_status: o };
                                var data = $rootScope.formatInputString(param);
                                RefState.post(data).then(function(response) {

                                    if (response.data.status == 1) {
                                        localStorage.setItem("refrstate", 3);
                                    } else {
                                        return false;
                                    }
                                })
                            }
                        }
                    }
                    if (localStorage.getItem('currentSate')) {
                        var u = 1,
                            q = 2,
                            o = 3;
                        var _state = localStorage.getItem('currentSate');

                        if (_state == 'upload-video') {

                            var param = { user_id: $rootScope.user_id, ref_status: u };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {

                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 1);
                                } else {
                                    return false;
                                }
                            })
                        } else if ((_state == 'questions')) {

                            var param = { user_id: $rootScope.user_id, ref_status: q };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 2);
                                } else {
                                    return false;
                                }
                            })
                        } else if ((_state == 'campaignBrowse') || (_state == 'contribution') ||
                            (_state == 'thanksAfterContribution')) {
                            if (localStorage.getItem('actualState')) {
                                var _stateSub = localStorage.getItem('actualState');
                                if (_stateSub == 2 || _stateSub == 'questions') {
                                    var param = { user_id: $rootScope.user_id, ref_status: q };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 2);
                                        } else {
                                            return false;
                                        }
                                    })
                                }
                                if (_stateSub == 1 || _stateSub == 'upload-video') {
                                    var param = { user_id: $rootScope.user_id, ref_status: u };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 1);
                                        } else {
                                            return false;
                                        }

                                    })
                                }
                            } else {
                                var param = { user_id: $rootScope.user_id, ref_status: o };
                                var data = $rootScope.formatInputString(param);
                                RefState.post(data).then(function(response) {
                                    if (response.data.status == 1) {
                                        localStorage.setItem("refrstate", 3);
                                    } else {
                                        return false;
                                    }
                                })
                            }
                        } else {

                            if (localStorage.getItem('actualState')) {

                                var current_state = localStorage.getItem('actualState');

                            }
                            if ($rootScope.user.userInfo.result.campaign.length != 0) {
                                if ($rootScope.campaign_status == 0) {
                                    var param = { user_id: $rootScope.user_id, ref_status: o };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 3);
                                        } else {
                                            return false;
                                        }

                                    })
                                } else if ((current_state == 'upload-video') && ($rootScope.campaign_status == 1)) {
                                    var param = { user_id: $rootScope.user_id, ref_status: u };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 1);
                                        } else {
                                            return false;
                                        }
                                    })
                                } else {

                                    if (localStorage.getItem('actualState')) {
                                        var _stateSub = localStorage.getItem('actualState');
                                        if (_stateSub == 2 || _stateSub == 'questions') {
                                            var param = { user_id: $rootScope.user_id, ref_status: q };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {
                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 2);
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }
                                        if (_stateSub == 1 || _stateSub == 'upload-video') {
                                            var param = { user_id: $rootScope.user_id, ref_status: u };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {
                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 1);
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }
                                    } else {
                                        var param = { user_id: $rootScope.user_id, ref_status: o };
                                        var data = $rootScope.formatInputString(param);
                                        RefState.post(data).then(function(response) {
                                            if (response.data.status == 1) {
                                                localStorage.setItem("refrstate", 3);
                                            } else {
                                                return false;
                                            }
                                        })
                                    }
                                }
                            } else {
                                var param = { user_id: $rootScope.user_id, ref_status: o };
                                var data = $rootScope.formatInputString(param);
                                RefState.post(data).then(function(response) {
                                    if (response.data.status == 1) {
                                        localStorage.setItem("refrstate", 3);
                                    } else {
                                        return false;
                                    }
                                })
                            }
                        }
                    }
                } else {
                    var u = 1,
                        q = 2,
                        o = 3;
                    if (localStorage.getItem('actualState')) {
                        var _state = localStorage.getItem('actualState');
                        if ((_state == 'upload-video')) {
                            var param = { user_id: $rootScope.user_id, ref_status: u };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 1);
                                } else {
                                    return false;
                                }
                            })

                        } else if ((_state == 'questions')) {

                            var param = { user_id: $rootScope.user_id, ref_status: q };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 2);
                                } else {
                                    return false;
                                }
                            })

                        } else if ((_state == 'campaignBrowse') || (_state == 'contribution') ||
                            (_state == 'thanksAfterContribution')) {
                            var param = { user_id: $rootScope.user_id, ref_status: o };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 3);
                                } else {
                                    return false;
                                }
                            })
                        } else {

                            if ($rootScope.user.userInfo.result.campaign.length != 0) {
                                if ($rootScope.campaign_status == 0) {
                                    var param = { user_id: $rootScope.user_id, ref_status: o };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 3);
                                        } else {
                                            return false;
                                        }
                                    })

                                } else if ((_state == 'upload-video') && ($rootScope.campaign_status == 1)) {
                                    var param = { user_id: $rootScope.user_id, ref_status: u };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 1);
                                        } else {
                                            return false;
                                        }
                                    })

                                } else {
                                    if (localStorage.getItem('actualState')) {
                                        var _stateSub = localStorage.getItem('actualState');
                                        if (_stateSub == 2 || _stateSub == 'questions') {
                                            var param = { user_id: $rootScope.user_id, ref_status: q };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {
                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 2);
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }
                                        if (_stateSub == 1 || _stateSub == 'upload-video') {
                                            var param = { user_id: $rootScope.user_id, ref_status: u };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {
                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 1);
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }
                                    } else {
                                        var param = { user_id: $rootScope.user_id, ref_status: o };
                                        var data = $rootScope.formatInputString(param);
                                        RefState.post(data).then(function(response) {
                                            if (response.data.status == 1) {
                                                localStorage.setItem("refrstate", 3);
                                            } else {
                                                return false;
                                            }
                                        })
                                    }

                                }
                            } else {
                                var param = { user_id: $rootScope.user_id, ref_status: o };
                                var data = $rootScope.formatInputString(param);
                                RefState.post(data).then(function(response) {
                                    if (response.data.status == 1) {
                                        localStorage.setItem("refrstate", 3);
                                    } else {
                                        return false;
                                    }
                                })
                            }
                        }
                    }
                    if (localStorage.getItem('currentSate')) {
                        var u = 1,
                            q = 2,
                            o = 3;
                        var _state = localStorage.getItem('currentSate');

                        if (_state == 'upload-video') {

                            var param = { user_id: $rootScope.user_id, ref_status: u };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 1);
                                } else {
                                    return false;
                                }
                            })
                        } else if ((_state == 'questions')) {

                            var param = { user_id: $rootScope.user_id, ref_status: q };
                            var data = $rootScope.formatInputString(param);
                            RefState.post(data).then(function(response) {
                                if (response.data.status == 1) {
                                    localStorage.setItem("refrstate", 2);
                                } else {
                                    return false;
                                }
                            })
                        } else if ((_state == 'campaignBrowse') || (_state == 'contribution') ||
                            (_state == 'thanksAfterContribution')) {
                            if (localStorage.getItem('actualState')) {
                                var _stateSub = localStorage.getItem('actualState');
                                if (_stateSub == 2 || _stateSub == 'questions') {
                                    var param = { user_id: $rootScope.user_id, ref_status: q };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 2);
                                        } else {
                                            return false;
                                        }
                                    })
                                }
                                if (_stateSub == 1 || _stateSub == 'upload-video') {
                                    var param = { user_id: $rootScope.user_id, ref_status: u };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 1);
                                        } else {
                                            return false;
                                        }
                                    })
                                }
                            } else {
                                var param = { user_id: $rootScope.user_id, ref_status: o };
                                var data = $rootScope.formatInputString(param);
                                RefState.post(data).then(function(response) {
                                    if (response.data.status == 1) {
                                        localStorage.setItem("refrstate", 3);
                                    } else {
                                        return false;
                                    }
                                })
                            }
                        } else {
                            var u = 1,
                                q = 2,
                                o = 3;
                            if (localStorage.getItem('actualState')) {

                                var current_state = localStorage.getItem('actualState');

                            }
                            if ($rootScope.user.userInfo.result.campaign.length != 0) {
                                if ($rootScope.campaign_status == 0) {
                                    var param = { user_id: $rootScope.user_id, ref_status: o };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 3);
                                        } else {
                                            return false;
                                        }
                                    })
                                } else if ((current_state == 'upload-video') && ($rootScope.campaign_status == 1)) {
                                    var param = { user_id: $rootScope.user_id, ref_status: u };
                                    var data = $rootScope.formatInputString(param);
                                    RefState.post(data).then(function(response) {
                                        if (response.data.status == 1) {
                                            localStorage.setItem("refrstate", 1);
                                        } else {
                                            return false;
                                        }
                                    })
                                } else {

                                    if (localStorage.getItem('actualState')) {
                                        var _stateSub = localStorage.getItem('actualState');
                                        if (_stateSub == 2 || _stateSub == 'questions') {
                                            var param = { user_id: $rootScope.user_id, ref_status: q };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {
                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 2);
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }
                                        if (_stateSub == 1 || _stateSub == 'upload-video') {
                                            var param = { user_id: $rootScope.user_id, ref_status: u };
                                            var data = $rootScope.formatInputString(param);
                                            RefState.post(data).then(function(response) {
                                                if (response.data.status == 1) {
                                                    localStorage.setItem("refrstate", 1);
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }
                                    } else {
                                        var param = { user_id: $rootScope.user_id, ref_status: o };
                                        var data = $rootScope.formatInputString(param);
                                        RefState.post(data).then(function(response) {
                                            if (response.data.status == 1) {
                                                localStorage.setItem("refrstate", 3);
                                            } else {
                                                return false;
                                            }
                                        })
                                    }
                                }
                            } else {
                                var param = { user_id: $rootScope.user_id, ref_status: o };
                                var data = $rootScope.formatInputString(param);
                                RefState.post(data).then(function(response) {
                                    if (response.data.status == 1) {
                                        localStorage.setItem("refrstate", 3);
                                    } else {
                                        return false;
                                    }
                                })
                            }
                        }
                    }
                    $rootScope.profile_complete_show_progress = '0';

                }

            }
            $rootScope.check = '1';
            $rootScope.user_details = JSON.parse(localStorage.getItem('userInfo'));
            $rootScope.userId = $rootScope.user_details.userInfo.result[0].user_id;
            $rootScope.wallet = $rootScope.user_details.userInfo.result.wallet;
            $rootScope.total_campaign = $rootScope.user_details.userInfo.result.total_campaign;
            $rootScope.username = $rootScope.user_details.userInfo.result[0].username;
            $rootScope.other_user_details = JSON.parse(localStorage.getItem('userInfo'));
            if ($rootScope.other_user_details.userInfo.result.profile_videos.length === 0) {
                $rootScope.unCompleteCampaign = '1';
            } else if (localStorage.getItem('endcampaign') && localStorage.getItem('campaignCompleteOrNot')) {

                $rootScope.unCompleteCampaign = '1';
            } else {
                $rootScope.unCompleteCampaign = '0';
            }

            $rootScope.my_details_other_profile = $localstorage.getObject('userInfo');
            $rootScope.my_details = '';
            $rootScope.my_details = JSON.parse(localStorage.getItem('userInfo'));
            $rootScope.contributions = [];
            for (var i = 0; i < $rootScope.other_user_details.userInfo.result.contributor.length; i++) {


                $rootScope.contributions.push($rootScope.other_user_details.userInfo.result.contributor[i]);
            }

            if ($rootScope.user.userInfo.result[0].user_id == null || $rootScope.user.userInfo.result[0].user_id == '') {

                $rootScope.profileImg_blur = angular.element(document.querySelector('#profileMainImage'));
                $rootScope.profileImg_blur.addClass('blur_image_and_campaign');
            }

        } else {
            $rootScope.user_id = '';
            $rootScope.userId = '';
        }
    };
});

futronics.service('AllUser_MyContribution', function($rootScope, $localstorage) {
    this.storage = function() {
        $rootScope.allUser = [];
        $rootScope.all_user_details = JSON.parse(localStorage.getItem('allUserDetails'));
        for (var i = 0; i < $rootScope.all_user_details.length; i++) {
            if ($rootScope.all_user_details[i].campaign.length > 0 && $rootScope.all_user_details[i].profile_videos.length > 0) {
                if ($rootScope.all_user_details[i].campaign[0].campaign_status === '1') {
                    $rootScope.allUser.push($rootScope.all_user_details[i]);
                }
            }
        }
    };
});
futronics.service('endcampaign', function($http, $q, $localstorage, URL, $rootScope) {
    this.userEndCampaign = function(data) {

        var endCampaignUrl;
        if ($rootScope.isMaintain == 'false') {
            endCampaignUrl = "/endtheCampain";
        } else {
            endCampaignUrl = "/endtheCampainMaintence";
        }
        var defered = $q.defer();

        return $http({
            method: "POST",
            url: URL.BASE + endCampaignUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            var user_info = JSON.parse(localStorage.getItem("userInfo"));
            user_info.userInfo.result.campaign[0].campaign_status = "0";
            user_info.userInfo.result.wallet = response.data.result.wallet;
            var update_userInfo = JSON.stringify(user_info);
            localStorage.setItem("userInfo", update_userInfo);
            var all_user_details = JSON.parse(localStorage.getItem("allUserDetails"));
            for (var i = 0; i < all_user_details.length; i++) {
                if (all_user_details[i].campaign.length > 0) {
                    if (all_user_details[i].campaign[0].user_id == user_info.userInfo.result[0].user_id) {
                        all_user_details[i].campaign[0].campaign_status = "0";
                        var updated_allUserDetails = JSON.stringify(all_user_details);
                        localStorage.setItem("allUserDetails", updated_allUserDetails);
                    }
                }
            }
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            defered.reject(error);
        });

    };
});

futronics.service('SetHideOrShowActive', function($rootScope, $q, $localstorage, URL, Loader, $http) {
    this.hide_show_post = function(data) {
        var url;
        if ($rootScope.isMaintain == 'false') {
            url = "/upd_hideShowcamp_stat";
        } else {
            url = "/upd_hideShowcamp_stat_maintainence";
        }
        var defered = $q.defer();
        return $http({
            method: "POST",
            url: URL.BASE + url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            console.log(response + "upd_hideShowcamp_stat");
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };

    this.hide_show_get = function(data) {
        var defered = $q.defer();
        var _url;
        if ($rootScope.isMaintain == 'false') {
            _url = "/get_hideShowcamp_stat";
        } else {
            _url = "/get_hideShowcamp_stat_maintainence";
        }
        return $http({
            method: "POST",
            url: URL.BASE + _url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function(response) {
            console.log(response + "get_hideShowcamp_stat");
            Loader.hideLoading();
            defered.resolve(response);
            return defered.promise;
        }, function(error) {
            Loader.hideLoading();
            console.log(error + "error");
            defered.reject(error);
        });
    };
});