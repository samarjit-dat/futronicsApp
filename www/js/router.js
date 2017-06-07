futronics.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching 
    $ionicConfigProvider.views.maxCache(0);
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);

    $stateProvider
        .state('splash', {
            url: '/splash',
            templateUrl: 'templates/splash-screen/splash-screen.html',
            controller: 'splashCtrl'
        })
        .state('globalChat', {
            url: "/globalChat",
            templateUrl: "templates/GlobalChat/globalChat.html",
            controller: 'globalChatControllers'
        })
        .state('upload-video', {
            url: "/upload-video",
            templateUrl: "templates/videoupload/videoupload.html",
            controller: 'VideoUploadCtrl'
        })
        .state('myCampaign', {
            url: "/myCampaign",
            templateUrl: 'templates/campaign/marketmycampaign.html',
            controller: 'marketmycampaignControllers'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/Account/Login/login.html',
            controller: 'LoginControllers'
        })
        .state('signup', {
            url: '/signup',
            params: {
                motivationAmount: null,
                fromEndCampaign: null
            },
            templateUrl: 'templates/Account/Signup/signup.html',
            controller: 'SignupControllers'
        })
        .state('campaignBrowse', {
            url: '/campaignBrowse',
            params: {
                motivationAmount: null
            },
            templateUrl: 'templates/campaign/campaignBrowse.html',
            controller: 'campaignBrowseControllers'
        })
        .state('chat', {
            url: '/chat',
            templateUrl: 'templates/Chat/chat.html',
            controller: 'ChatCtrl'

        })
        .state('profile', {
            url: '/profile',
            params: {
                id: null
            },
            templateUrl: 'templates/Profile/profile.html',
            controller: 'ProfileCtrl'
        })
        .state('profileViewStats', {
            url: '/profileViewStats',
            templateUrl: 'templates/ViewMyStats/profileViewStats.html',
            controller: 'ProfileViewStatsCtrl'

        })
        .state('withdrawCaloryAndCash', {
            url: '/withdrawCaloryAndCash',
            params: {
                showCashAndCalory: null
            },
            templateUrl: 'templates/ViewMyStats/withdrawCaloryAndCash/withdrawCaloryAndCash.html',
            controller: 'WithdrawCaloryAndCashCtrl'
        })
        .state('contribution', {
            url: '/contribution',
            templateUrl: 'templates/contribution/contribution.html',
            controller: 'contributionCtrl',
            params: {
                id: null
            }
        })
        .state('thanksAfterContribution', {
            url: '/thanksAfterContribution',
            templateUrl: 'templates/contribution/thanks_after_contribution.html',
            controller: 'thanksAfterContributionCtrl',
            params: {
                id: null,
                already_contributed: null
            }
        })
        .state('updateCampaign_video', {
            url: '/updateCampaign',
            templateUrl: 'templates/campaign/updatecampaign.html',
            controller: 'UpdateCampaignCtrl'
        })
        .state('account_settings', {
            url: '/account&settings',
            templateUrl: 'templates/settings/settings.html',
            controller: 'accountSettingsCtrl'
        })
        .state('account_settings_end_cnf_campaign', {
            url: '/account&settings_end_cnf_campaign',
            templateUrl: 'templates/campaign/endConfirmCampaign.html',
            controller: 'accountSettingsendcampaignCtrl'
        })
        .state('endCampaignProfile', {
            url: '/endCampaignProfile',
            templateUrl: 'templates/Profile/profile-endcampaign/profile-endcampaign.html',
            controller: 'profile-endcampaignCtrl'
        })
        .state('contactAdmin', {
            url: '/contactAdmin',
            templateUrl: 'templates/contactAdmin/contactAdmin.html',
            controller: 'contactAdminCtrl'
        })
        .state('myContribution', {
            url: '/myContribution',
            templateUrl: 'templates/contribution/myContribution.html',
            controller: 'myContributionCtrl'
        })
        .state('myContributionUserProfile', {
            url: '/myContributionUserProfile',
            templateUrl: 'templates/Profile/mySponsorsUserProfile/mySponsorsUserProfile.html',
            controller: 'myContributionUserProfileCtrl',
            params: {
                id: null
            }
        })
        .state('addFund', {
            url: '/addFund',
            templateUrl: 'templates/addFund/addFund.html',
            controller: 'addFundCtrl'

        })
        .state('congrats_videoupload', {
            url: '/congrats_videoupload',
            templateUrl: 'templates/videoupload/congrats_videoupload/congrats_videoupload.html',
            controller: 'CongratsVideoUploadCtrl'

        })
        .state('questions', {
            url: '/questions',
            templateUrl: 'templates/questionLists/questions.html',
            controller: 'questionListsCtrl'

        })
        .state('sponsorsAcquired', {
            url: '/sponsorsAcquired',
            templateUrl: 'templates/ViewMyStats/sponsorsAcquired/sponsorsAcquired.html',
            controller: 'sponsorsAcquiredCtrl'

        })
        .state('mySponsorsUserProfile', {
            url: '/mySponsorsUserProfile',
            templateUrl: 'templates/Profile/mySponsorsUserProfile/mySponsorsUserProfile.html',
            controller: 'mySponsorsUserProfileCtrl',
            params: {
                id: null
            }
        })
        // if none of the above states are matched, use this as the callback
    $urlRouterProvider.otherwise('/splash');
});