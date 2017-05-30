futronics.controller('questionListsCtrl',
    function($scope, StorageService, QuestionOneService,
        $rootScope, $window, $state, $localstorage, $ionicPopup, LogoutService, stateFactory,
        QuestionListService, $timeout, $ionicSlideBoxDelegate, CountryListService, Loader) {
        if (localStorage.getItem('userInfo')) {

            //if (localStorage.getItem('userInfo')) {
            var user = JSON.parse(localStorage.getItem('userInfo'));
            if (user.userInfo.result[0].user_id != null || user.userInfo.result[0].user_id != '') {
                var user_id = user.userInfo.result[0].user_id;
            }
            stateFactory.setCurrentState($state.current.name, user_id); // For getting value stateFactory.getCurrentState()
            stateFactory.getCurrentState(user_id);
        }
        // if($localstorage.get('StartQuestion')){
        //     $ionicPopup.show({
        //     template: 'You need to answer these questions to finish your campaign up.',  

        //     title: '<p style="color:black"><b>Attention!!!</b></p>',
        //     scope: $scope,
        //     buttons: [
        //         { text: 'Ok' ,
        //             type: 'button-calm'
        //         }
        //       ]
        //     });
        //     $localstorage.remove('StartQuestion');
        //  }  

        $scope.sliderProgress = 0;
        StorageService.storage();

        $scope.logout = function() {
            LogoutService.logout();
        };
        $scope.data = {};

        $scope.getValue = function(check) {
            $scope.getradio = 1;
            if (check == 'Yes, I only want close friends and family to back me.') {
                $scope.value = 1;
            } else {
                $scope.value = 0;
            }
        };
        $scope.styleChange = function() {
            var v = document.getElementById("slidr").querySelectorAll("span");
            v[7].style.visibility = "visible";
            v[7].style.left = "165px";
            v[8].style.left = "0px";
        };

        $scope.questionLists = [];
        QuestionListService.QuestionList().then(function(response) {
            console.clear()
            console.log('questionlist')
            console.log(response);

            $scope.ArrayQuestionlength = response.data.result.length;
            var index = $ionicSlideBoxDelegate.currentIndex();
            if (index == 0) {
                $scope.questionLists.push(response.data.result[0]);
                $ionicSlideBoxDelegate.enableSlide(false);
                $ionicSlideBoxDelegate.update();

                if (response.data.result[0].question_max != "0" || response.data.result[0].question_min != "0") {
                    $rootScope.max = response.data.result[0].question_max;
                    $rootScope.min = response.data.result[0].question_min;
                    if (response.data.result[0].question_is_fraction == 1) {
                        $rootScope.slidingAmount = parseFloat($rootScope.min);
                        $rootScope.slider = {
                            value: $rootScope.slidingAmount,
                            options: {
                                floor: parseFloat($rootScope.min),
                                ceil: parseFloat($rootScope.max),
                                step: 1,
                                translate: function(value) { return value + response.data.result[0].question_unit; },
                                id: 'slideEnded',
                                onEnd: $scope.myEndListener
                            }
                        };
                    }

                    if (response.data.result[0].question_is_fraction == 2) {
                        $rootScope.slidingAmount = parseFloat($rootScope.min);
                        $rootScope.slider = {
                            value: $rootScope.slidingAmount,
                            options: {
                                precision: 1,
                                floor: parseFloat($rootScope.min),
                                ceil: parseFloat($rootScope.max),
                                step: 0.1,
                                translate: function(value) {


                                    //console.log('res slide');
                                    var number = value * 10,
                                        output = [],
                                        sNumber = number.toString();

                                    for (var i = 0, len = sNumber.length; i < len; i += 1) {
                                        output.push(+sNumber.charAt(i));
                                    }

                                    //console.log(output);
                                    //console.log(value);
                                    return output[0] + response.data.result[0].question_subunit_one + output[1] + response.data.result[0].question_subunit_two;

                                },
                                id: 'slideEnded',
                                onEnd: $scope.myEndListener
                            }
                        };
                    }
                    $scope.$on("slideEnded", function() {
                        $rootScope.slidingAmount = ($scope.slider.value).toString();
                        localStorage.setItem('userWeight', $rootScope.slidingAmount);
                    });
                    $scope.slide = response.data.result[0].question_answer_type;
                    $scope.questionLists.push(response.data.result[index + 1]);
                } else if (response.data.result[0].question_api_url != "") {
                    var url = response.data.result[0].question_api;
                    CountryListService.getCountry(url).then(function(response) {
                        console.log(response);
                        $scope.countries = [];
                        for (var i = 0; i < response.data.result.length; i++) {
                            $scope.countries.push(response.data.result[i]);
                        }
                    })
                    $scope.slide = response.data.result[0].question_answer_type;
                    $scope.questionLists.push(response.data.result[index + 1]);
                } else if (response.data.result[0].question_radio != []) {
                    $scope.radioArrays = response.data.result[0].question_radio;
                    $scope.slide = response.data.result[0].question_answer_type;
                    $scope.questionLists.push(response.data.result[index + 1]);
                } else {
                    $scope.slide = response.data.result[0].question_answer_type;
                    $scope.questionLists.push(response.data.result[index + 1]);
                }
            }


        });

        $scope.myOwnProfile = function() {
            localStorage.removeItem('viewIndividualProfile_globalChat');
            localStorage.setItem('myProfile', '1');
            $state.go('profile');
        };

        $scope.radioArrays = [];

        $scope.question1 = function(data) {
            Loader.showLoading();
            var sliderVal = $scope.slider.value;

            if ($scope.slide == 1) {
                $scope.answer = sliderVal;
            }
            if ($scope.slide == 4) {
                $scope.answer = data.occupation;
            }
            if ($scope.slide == 2) {
                $scope.answer = data.selectedName.country_name;
            }
            if ($scope.slide == 6) {
                $scope.answer = $scope.value;
            }
            if ($scope.slide == 3) {
                $scope.aboutUser = localStorage.getItem('aboutDay');
                $scope.answer = $scope.aboutUser;
            }

            var first_question;

            if ($ionicSlideBoxDelegate.currentIndex() == 0) {
                first_question = "1";
            } else {
                first_question = "";
            }


            var currentSlide = $ionicSlideBoxDelegate.currentIndex() + 1;

            var totalSlides = $scope.ArrayQuestionlength + 1; // include video slide

            $rootScope.sliderProgress = $scope.sliderProgress = (100 - (100 - ((currentSlide / totalSlides) * 100))).toFixed(1);

            if (currentSlide == $scope.ArrayQuestionlength) {
                QuestionListService.QuestionList().then(function(response) {
                    $ionicSlideBoxDelegate.enableSlide(false);
                    $ionicSlideBoxDelegate.update();
                    var index = $ionicSlideBoxDelegate.currentIndex();
                    var current_index = index + 1;
                    $scope.indevalue = response.data.result[index + 1];
                    $scope.indexCurent = response.data.result[current_index + 1];
                    console.log("1");
                    console.log($scope.questionLists);
                    var campaignId = localStorage.getItem('myCampaignId');
                    console.log(campaignId)
                    var otherCampaignId = localStorage.getItem('ohter_user_campaign_id');
                    var data = {
                        question_id: response.data.result[index].question_id,
                        campaign_id: campaignId,
                        user_id: $rootScope.userId,
                        answer: $scope.answer,

                        to_id: $rootScope.to_id,
                        question_identifier: $scope.questionLists[index].question_identifier,
                        contributed_user_campaign_id: otherCampaignId

                    };

                    var data = $rootScope.formatInputString(data);

                    QuestionOneService.FirstQuestion(data).then(function(response) {
                        console.log('questionCTRL response*************');
                        console.log(response);
                        Loader.hideLoading();
                        if (response.data.status != "1") {
                            $ionicPopup.show({
                                template: 'Sorry!!!Something went wrong,Try again',
                                title: '<p style="color:black"><b>Error!!!</b></p>',
                                scope: $scope,
                                buttons: [{
                                    text: 'Ok',
                                    type: 'button-calm',
                                    onTap: function(e) {
                                        $state.go("globalChat");
                                        return;

                                    }
                                }]
                            });
                        } else {
                            $state.go('upload-video');
                        }
                    });

                });
            } else {

                QuestionListService.QuestionList().then(function(response) {

                    var index = $ionicSlideBoxDelegate.currentIndex();

                    var current_index = index + 1;
                    $scope.exactIndexx = response.data.result[index];
                    $scope.indevalue = response.data.result[index + 1];
                    $scope.indexCurent = response.data.result[current_index + 1];
                    console.log("2");
                    console.log($scope.questionLists);
                    if (index > 0) {
                        $ionicSlideBoxDelegate.enableSlide(false);
                        $ionicSlideBoxDelegate.update();
                        var campaignId = localStorage.getItem('myCampaignId');
                        console.log(campaignId)
                        var otherCampaignId = localStorage.getItem('ohter_user_campaign_id');
                        var data = {
                            question_id: response.data.result[index].question_id,
                            campaign_id: campaignId,
                            user_id: $rootScope.userId,
                            answer: $scope.answer,

                            to_id: $rootScope.to_id,
                            question_identifier: $scope.questionLists[index].question_identifier,

                            contributed_user_campaign_id: otherCampaignId
                        };

                        var data = $rootScope.formatInputString(data);

                        QuestionOneService.FirstQuestion(data).then(function(response) {
                            console.log('questionCTRL response*************');
                            console.log(response);
                            Loader.hideLoading();
                            if (response.data.status != "1") {
                                $ionicPopup.show({
                                    template: 'Sorry!!!Something went wrong,Try again',
                                    title: '<p style="color:black"><b>Error!!!</b></p>',
                                    scope: $scope,
                                    buttons: [{
                                        text: 'Ok',
                                        type: 'button-calm',
                                        onTap: function(e) {
                                            $state.go("globalChat");
                                            return;

                                        }
                                    }]
                                });
                            } else {
                                $ionicSlideBoxDelegate.next();
                                $ionicSlideBoxDelegate.enableSlide(false);
                                $ionicSlideBoxDelegate.update();

                                if ($scope.indevalue.question_max != "0" || $scope.indevalue.question_min != "0") {
                                    $rootScope.max = $scope.indevalue.question_max;
                                    $rootScope.min = $scope.indevalue.question_min;

                                    $scope.slide = $scope.indevalue.question_answer_type;
                                    $scope.questionLists.push($scope.indexCurent);

                                    if ($scope.indevalue.question_is_fraction == 1) {
                                        $rootScope.slidingAmount = parseFloat($rootScope.min);
                                        $rootScope.slider = {
                                            value: $rootScope.slidingAmount,
                                            options: {
                                                floor: parseFloat($rootScope.min),
                                                ceil: parseFloat($rootScope.max),
                                                step: 1,
                                                translate: function(value) { return value + $scope.indevalue.question_unit; },
                                                id: 'slideEnded',
                                                onEnd: $scope.myEndListener
                                            }
                                        };
                                    }

                                    if ($scope.indevalue.question_is_fraction == 2) {
                                        $rootScope.slidingAmount = parseFloat($rootScope.min);
                                        $rootScope.slider = {
                                            value: $rootScope.slidingAmount,
                                            options: {
                                                precision: 1,
                                                floor: parseFloat($rootScope.min),
                                                ceil: parseFloat($rootScope.max),
                                                step: 0.1,
                                                translate: function(value) {


                                                    //console.log('res slide');
                                                    var number = value * 10,
                                                        output = [],
                                                        sNumber = number.toString();

                                                    for (var i = 0, len = sNumber.length; i < len; i += 1) {
                                                        output.push(+sNumber.charAt(i));
                                                    }

                                                    //console.log(output);
                                                    //console.log(value);
                                                    return output[0] + $scope.indevalue.question_subunit_one + output[1] + $scope.indevalue.question_subunit_two;

                                                },
                                                id: 'slideEnded',
                                                onEnd: $scope.myEndListener
                                            }
                                        };
                                    }
                                    $scope.$on("slideEnded", function() {
                                        $rootScope.slidingAmount = ($scope.slider.value).toString();
                                        localStorage.setItem('userWeight', $rootScope.slidingAmount);
                                    });
                                } else if ($scope.indevalue.question_api_url != "") {
                                    var url = $scope.indevalue.question_api;
                                    CountryListService.getCountry(url).then(function(response) {
                                        console.log(response);
                                        $scope.countries = [];
                                        for (var i = 0; i < response.data.result.length; i++) {
                                            $scope.countries.push(response.data.result[i]);
                                        }
                                    })
                                    $scope.slide = $scope.indevalue.question_answer_type;
                                    $scope.questionLists.push($scope.indexCurent);
                                } else if ($scope.indevalue.question_radio != []) {
                                    $scope.radioArrays = $scope.indevalue.question_radio;
                                    $scope.slide = $scope.indevalue.question_answer_type;
                                    $scope.questionLists.push($scope.indexCurent);
                                } else {
                                    $scope.slide = $scope.indevalue.question_answer_type;
                                    $scope.questionLists.push($scope.indexCurent);
                                }

                            }

                        });

                    } else {
                        $ionicSlideBoxDelegate.enableSlide(false);
                        $ionicSlideBoxDelegate.update();
                        var campaignId = localStorage.getItem('myCampaignId');
                        console.log(campaignId)
                        var otherCampaignId = localStorage.getItem('ohter_user_campaign_id');
                        var data = {
                            question_id: response.data.result[index].question_id,
                            campaign_id: campaignId,
                            user_id: $rootScope.userId,
                            answer: $scope.answer,
                            to_id: $rootScope.to_id,
                            question_identifier: $scope.questionLists[index].question_identifier,
                            contributed_user_campaign_id: otherCampaignId

                        };

                        var data = $rootScope.formatInputString(data);

                        QuestionOneService.FirstQuestion(data).then(function(response) {
                            console.log('questionCTRL response*************');
                            console.log(response);
                            Loader.hideLoading();
                            if (response.data.status != "1") {
                                $ionicPopup.show({
                                    template: 'Sorry!!!Something went wrong,Try again',
                                    title: '<p style="color:black"><b>Error!!!</b></p>',
                                    scope: $scope,
                                    buttons: [{
                                        text: 'Ok',
                                        type: 'button-calm',
                                        onTap: function(e) {
                                            $state.go("globalChat");
                                            return;

                                        }
                                    }]
                                });
                            } else {
                                $ionicSlideBoxDelegate.next();
                                $ionicSlideBoxDelegate.enableSlide(false);
                                $ionicSlideBoxDelegate.update();

                                if ($scope.indevalue.question_max != "0" || $scope.indevalue.question_min != "0") {
                                    $rootScope.max = $scope.indevalue.question_max;
                                    $rootScope.min = $scope.indevalue.question_min;

                                    $scope.slide = $scope.indevalue.question_answer_type;
                                    $scope.questionLists.push($scope.indexCurent);
                                    if ($scope.indevalue.question_is_fraction == 1) {
                                        $rootScope.slidingAmount = parseFloat($rootScope.min);
                                        $rootScope.slider = {
                                            value: $rootScope.slidingAmount,
                                            options: {
                                                floor: parseFloat($rootScope.min),
                                                ceil: parseFloat($rootScope.max),
                                                step: 1,
                                                translate: function(value) { return value + $scope.indevalue.question_unit; },
                                                id: 'slideEnded',
                                                onEnd: $scope.myEndListener
                                            }
                                        };
                                    }
                                    if ($scope.indevalue.question_is_fraction == 2) {
                                        $rootScope.slidingAmount = parseFloat($rootScope.min);
                                        $rootScope.slider = {
                                            value: $rootScope.slidingAmount,
                                            //                            options:{
                                            //                                precision:1,floor: parseFloat($rootScope.min),ceil: parseFloat($rootScope.max) ,step: 0.1,
                                            //                                translate: function(value) {return  value +$scope.indevalue.question_unit;},
                                            //                                id: 'slideEnded',onEnd: $scope.myEndListener
                                            //                            }

                                            options: {
                                                precision: 1,
                                                floor: parseFloat($rootScope.min),
                                                ceil: parseFloat($rootScope.max),
                                                step: 0.1,
                                                translate: function(value) {


                                                    //console.log('res slide');
                                                    var number = value * 10,
                                                        output = [],
                                                        sNumber = number.toString();

                                                    for (var i = 0, len = sNumber.length; i < len; i += 1) {
                                                        output.push(+sNumber.charAt(i));
                                                    }

                                                    //console.log(output);
                                                    //console.log(value);
                                                    return output[0] + $scope.indevalue.question_subunit_one + output[1] + $scope.indevalue.question_subunit_two;

                                                },
                                                id: 'slideEnded',
                                                onEnd: $scope.myEndListener
                                            }
                                        };
                                    }
                                    $scope.$on("slideEnded", function() {
                                        $rootScope.slidingAmount = ($scope.slider.value).toString();
                                        localStorage.setItem('userWeight', $rootScope.slidingAmount);
                                    });
                                }

                            }

                        });
                    }

                });
            }
        };




    });